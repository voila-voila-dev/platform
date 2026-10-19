import { Effect } from "effect";
import ExcelJS from "exceljs";
import { ImportFileRejectedError } from "#bulk-import/errors/import-file-rejected-error";
import type { ImportReader } from "#bulk-import/services/import-readers";

async function readFirstWorksheet(bytes: Uint8Array) {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(new Uint8Array(bytes).buffer);
	const sheet = workbook.worksheets[0];
	if (sheet === undefined) return [];
	const lines: Array<Array<string>> = [];
	sheet.eachRow({ includeEmpty: false }, (row) => {
		const cells: Array<string> = [];
		for (let column = 1; column <= sheet.columnCount; column += 1)
			cells.push(row.getCell(column).text.trim());
		lines.push(cells);
	});
	return lines;
}

// Reads the first worksheet, each cell as Excel displays it.
export const xlsxImportReader: ImportReader = {
	format: "xlsx",
	read: (bytes) =>
		Effect.tryPromise({
			try: () => readFirstWorksheet(bytes),
			catch: () => new ImportFileRejectedError({ reason: "Unreadable" }),
		}),
};
