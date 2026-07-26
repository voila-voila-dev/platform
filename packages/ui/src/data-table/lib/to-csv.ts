import type { Table as TanstackTable } from "@tanstack/react-table";

/** RFC 4180: quotes double up, and any field containing them is quoted. */
function toCsvField(value: unknown): string {
	const text = value === null || value === undefined ? "" : String(value);
	return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/**
 * Serializes the rows the user is currently looking at — filtered and sorted,
 * visible columns only — to CSV. Exported so a consumer can send the same bytes
 * somewhere other than a download.
 */
export function dataTableToCsv<TData>(table: TanstackTable<TData>): string {
	const columns = table.getVisibleLeafColumns();
	const header = columns.map((column) =>
		toCsvField(
			typeof column.columnDef.header === "string"
				? column.columnDef.header
				: column.id,
		),
	);
	const rows = table
		.getSortedRowModel()
		.rows.map((row) =>
			columns.map((column) => toCsvField(row.getValue(column.id))),
		);
	return [header, ...rows].map((cells) => cells.join(",")).join("\r\n");
}
