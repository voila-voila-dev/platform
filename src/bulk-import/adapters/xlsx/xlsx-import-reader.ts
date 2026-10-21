import { Effect } from "effect";
import ExcelJS from "exceljs";
import { ImportFileRejectedError } from "#bulk-import/errors/import-file-rejected-error";
import type { ImportReader } from "#bulk-import/services/import-reader";
import { ImportFormat } from "#bulk-import/value-objects/import-format";

// Excel stores a date as a day count it shows in the reader's locale; ISO 8601
// reads the same anywhere. Its dates carry no zone, so exceljs reads them as UTC.
function cellText(cell: ExcelJS.Cell) {
	if (!(cell.value instanceof Date)) return cell.text.trim();
	const iso = cell.value.toISOString();
	return iso.endsWith("T00:00:00.000Z")
		? iso.slice(0, 10)
		: iso.slice(0, 19).replace("T", " ");
}

async function readFirstWorksheet(bytes: Uint8Array) {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(new Uint8Array(bytes).buffer);
	const sheet = workbook.worksheets[0];
	if (sheet === undefined) return [];
	const lines: Array<Array<string>> = [];
	sheet.eachRow({ includeEmpty: false }, (row) => {
		const cells: Array<string> = [];
		for (let column = 1; column <= sheet.columnCount; column += 1)
			cells.push(cellText(row.getCell(column)));
		lines.push(cells);
	});
	return lines;
}

// Reads the first worksheet, each cell as Excel displays it but dates.
export const xlsxImportReader: ImportReader = {
	format: ImportFormat.make("xlsx"),
	read: (bytes) =>
		Effect.tryPromise({
			try: () => readFirstWorksheet(bytes),
			catch: () => new ImportFileRejectedError({ reason: "unreadable" }),
		}),
};
