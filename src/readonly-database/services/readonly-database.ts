import { Context, type Effect, type Schema } from "effect";
import type { ReadonlyQueryError } from "#readonly-database/errors/readonly-query-error";

export interface JsonRow {
	readonly [column: string]: Schema.Json;
}

export interface ReadonlyQueryResult {
	readonly columns: ReadonlyArray<string>;
	readonly rows: ReadonlyArray<JsonRow>;
	/** The result crossed the adapter's byte cap and was cut. */
	readonly truncated: boolean;
}

export interface ColumnDescription {
	readonly table: string;
	readonly column: string;
	readonly type: string;
	readonly nullable: boolean;
}

// The posture (a read-only role, a statement timeout, a result cap) belongs to
// the adapter; callers still run every statement through `guardQuery` so a
// refusal is explained rather than surfacing as a permission error.
export class ReadonlyDatabase extends Context.Service<
	ReadonlyDatabase,
	{
		readonly query: (
			sql: string,
		) => Effect.Effect<ReadonlyQueryResult, ReadonlyQueryError>;
		readonly describeTables: (
			tables: ReadonlyArray<string>,
		) => Effect.Effect<ReadonlyArray<ColumnDescription>, ReadonlyQueryError>;
	}
>()("@voila.dev/platform/ReadonlyDatabase") {}
