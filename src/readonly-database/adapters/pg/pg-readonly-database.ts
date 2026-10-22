import { Effect, Layer } from "effect";
import { Pool, type PoolConfig } from "pg";
import { toJsonValue } from "#readonly-database/adapters/pg/to-json-value";
import { ReadonlyQueryError } from "#readonly-database/errors/readonly-query-error";
import {
	type JsonRow,
	ReadonlyDatabase,
} from "#readonly-database/services/readonly-database";

export interface PgReadonlyDatabaseOptions {
	readonly maxResultBytes?: number;
	readonly statementTimeoutMillis?: number;
	readonly poolMaximum?: number;
	readonly schema?: string;
}

function toJsonRow(row: Record<string, unknown>): JsonRow {
	return Object.fromEntries(
		Object.entries(row).map(([column, cell]) => [column, toJsonValue(cell)]),
	);
}

function boundRows(
	rows: ReadonlyArray<JsonRow>,
	maxBytes: number,
): { readonly rows: ReadonlyArray<JsonRow>; readonly truncated: boolean } {
	let bytes = 0;
	const kept: Array<JsonRow> = [];
	for (const row of rows) {
		bytes += JSON.stringify(row).length;
		if (bytes > maxBytes) return { rows: kept, truncated: true };
		kept.push(row);
	}
	return { rows: kept, truncated: false };
}

// A pg error also carries the client that raised it, password included: only
// its message leaves this adapter.
function failure(cause: unknown): ReadonlyQueryError {
	return new ReadonlyQueryError({
		message: cause instanceof Error ? cause.message : String(cause),
	});
}

// The posture is set on the connection itself, on top of whatever grants the
// role carries: a query the guard misses still cannot write.
export function pgReadonlyDatabase(
	config: PoolConfig,
	options: PgReadonlyDatabaseOptions = {},
) {
	const {
		maxResultBytes = 64 * 1024,
		statementTimeoutMillis = 5000,
		poolMaximum = 2,
		schema = "public",
	} = options;
	return Layer.effect(
		ReadonlyDatabase,
		Effect.gen(function* () {
			const context = yield* Effect.context();
			const pool = yield* Effect.acquireRelease(
				Effect.sync(() => {
					const created = new Pool({
						...config,
						max: poolMaximum,
						statement_timeout: statementTimeoutMillis,
						options: [config.options, "-c default_transaction_read_only=on"]
							.filter((option) => option !== undefined)
							.join(" "),
					});
					// An idle client losing its connection must not crash the process.
					created.on("error", (error) =>
						Effect.runForkWith(context)(
							Effect.logWarning("readonly database connection lost", error),
						),
					);
					return created;
				}),
				(opened) => Effect.promise(() => opened.end()),
			);

			function run<Row extends Record<string, unknown>>(
				sql: string,
				params: ReadonlyArray<unknown> = [],
			) {
				return Effect.tryPromise({
					try: () => pool.query<Row>(sql, [...params]),
					catch: failure,
				});
			}

			return {
				query: (sql) =>
					run(sql).pipe(
						Effect.map((result) => ({
							columns: result.fields.map((field) => field.name),
							...boundRows(result.rows.map(toJsonRow), maxResultBytes),
						})),
					),
				describeTables: (tables) =>
					run<{
						table_name: string;
						column_name: string;
						data_type: string;
						is_nullable: string;
					}>(
						`SELECT table_name, column_name, data_type, is_nullable
						 FROM information_schema.columns
						 WHERE table_schema = $1 AND table_name = ANY($2::text[])
						 ORDER BY table_name, ordinal_position`,
						[schema, [...tables]],
					).pipe(
						Effect.map((result) =>
							result.rows.map((row) => ({
								table: row.table_name,
								column: row.column_name,
								type: row.data_type,
								nullable: row.is_nullable === "YES",
							})),
						),
					),
			};
		}),
	);
}
