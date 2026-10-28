import { getTableColumns, sql } from "drizzle-orm";
import type { PgTable, PgUpdateSetSource } from "drizzle-orm/pg-core";

export function updateSetFromColumns<Table extends PgTable>(
	table: Table,
	exclude: ReadonlyArray<string> = ["id", "createdAt"],
): PgUpdateSetSource<Table> {
	const excludedNames = new Set(exclude);
	const entries = Object.entries(getTableColumns(table))
		.filter(([key]) => !excludedNames.has(key))
		.map(([key, column]) => [key, sql.raw(`excluded."${column.name}"`)]);
	return Object.fromEntries(entries) as PgUpdateSetSource<Table>;
}
