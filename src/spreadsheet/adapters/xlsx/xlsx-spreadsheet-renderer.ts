import { Buffer } from "node:buffer";
import { Effect, Layer } from "effect";
import type ExcelJS from "exceljs";
import { SpreadsheetRenderer } from "#spreadsheet/services/spreadsheet-renderer";
import type { SpreadsheetCellStyle } from "#spreadsheet/value-objects/spreadsheet-cell-style";
import type { SpreadsheetDocument } from "#spreadsheet/value-objects/spreadsheet-document";
import type { SpreadsheetSheet } from "#spreadsheet/value-objects/spreadsheet-sheet";

const BORDER_COLOR = "FFBFBFBF";

function toArgb(hex: string): string {
	return hex.length === 8 ? hex : `FF${hex}`;
}

function applyCellStyle(target: ExcelJS.Cell, style: SpreadsheetCellStyle) {
	target.font = {
		bold: style.bold,
		italic: style.italic,
		size: style.fontSize,
		...(style.fontColor && { color: { argb: toArgb(style.fontColor) } }),
	};
	if (style.fillColor) {
		target.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: toArgb(style.fillColor) },
		};
	}
	target.alignment = {
		horizontal: style.align,
		vertical: "middle",
		wrapText: style.wrap,
	};
	if (style.numberFormat) target.numFmt = style.numberFormat;
	if (style.border) {
		const side = { style: "thin" as const, color: { argb: BORDER_COLOR } };
		target.border = { top: side, left: side, bottom: side, right: side };
	}
}

function writeSheet(workbook: ExcelJS.Workbook, sheet: SpreadsheetSheet) {
	const worksheet = workbook.addWorksheet(sheet.name, {
		...(sheet.freezeRows && {
			views: [{ state: "frozen", ySplit: sheet.freezeRows }],
		}),
	});

	sheet.columns?.forEach((column, index) => {
		if (column.width !== undefined)
			worksheet.getColumn(index + 1).width = column.width;
	});

	sheet.rows.forEach((row, rowIndex) => {
		const excelRow = worksheet.getRow(rowIndex + 1);
		let column = 1;
		for (const cell of row.cells) {
			const target = excelRow.getCell(column);
			if (cell.value !== null) target.value = cell.value;
			if (cell.style) applyCellStyle(target, cell.style);
			const span = cell.colSpan ?? 1;
			if (span > 1)
				worksheet.mergeCells(
					rowIndex + 1,
					column,
					rowIndex + 1,
					column + span - 1,
				);
			column += span;
		}
		if (row.height !== undefined) excelRow.height = row.height;
	});

	for (const image of sheet.images ?? []) {
		const imageId = workbook.addImage({
			base64: Buffer.from(image.content).toString("base64"),
			extension: image.extension,
		});
		worksheet.addImage(imageId, {
			tl: { col: image.column, row: image.row },
			ext: { width: image.widthPx, height: image.heightPx },
		});
	}
}

async function renderWorkbook(document: SpreadsheetDocument) {
	// Loaded on the first render: a document built next to code a browser bundle
	// shares keeps exceljs out of that bundle.
	const { default: Excel } = await import("exceljs");
	const workbook = new Excel.Workbook();
	for (const sheet of document.sheets) writeSheet(workbook, sheet);
	return new Uint8Array(await workbook.xlsx.writeBuffer());
}

export const xlsxSpreadsheetRenderer = Layer.succeed(SpreadsheetRenderer, {
	render: (document) => Effect.promise(() => renderWorkbook(document)),
});
