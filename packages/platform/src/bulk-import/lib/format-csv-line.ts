export function formatCsvLine(cells: ReadonlyArray<string>): string {
	return cells
		.map((cell) =>
			/[",\n\r]/u.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell,
		)
		.join(",");
}
