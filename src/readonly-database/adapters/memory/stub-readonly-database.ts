import { Effect, Layer } from "effect";
import { ReadonlyDatabase } from "#readonly-database/services/readonly-database";
import type { ColumnDescription } from "#readonly-database/value-objects/column-description";
import type { ReadonlyQueryResult } from "#readonly-database/value-objects/readonly-query-result";

export function stubReadonlyDatabase(
	options: {
		readonly result?: (sql: string) => ReadonlyQueryResult;
		readonly columns?: ReadonlyArray<ColumnDescription>;
	} = {},
) {
	const queries: Array<string> = [];
	const { result = () => ({ columns: [], rows: [], truncated: false }) } =
		options;
	return {
		queries,
		layer: Layer.succeed(ReadonlyDatabase, {
			query: (sql) =>
				Effect.sync(() => {
					queries.push(sql);
					return result(sql);
				}),
			describeTables: (tables) =>
				Effect.succeed(
					(options.columns ?? []).filter((column) =>
						tables.includes(column.table),
					),
				),
		}),
	};
}
