import { DEFAULT_SPREADSHEET_CELL_STYLE } from "#spreadsheet/constants/default-spreadsheet-cell-style";
import type { SpreadsheetCell } from "#spreadsheet/value-objects/spreadsheet-cell";
import type { SpreadsheetCellStyle } from "#spreadsheet/value-objects/spreadsheet-cell-style";
import type { SpreadsheetCellValue } from "#spreadsheet/value-objects/spreadsheet-cell-value";

export function cellStyle(
	overrides: Partial<SpreadsheetCellStyle>,
): SpreadsheetCellStyle {
	return { ...DEFAULT_SPREADSHEET_CELL_STYLE, ...overrides };
}

export function cell(
	value: SpreadsheetCellValue,
	style?: Partial<SpreadsheetCellStyle>,
): SpreadsheetCell {
	return style ? { value, style: cellStyle(style) } : { value };
}

export function mergedCell(
	value: SpreadsheetCellValue,
	colSpan: number,
	style?: Partial<SpreadsheetCellStyle>,
): SpreadsheetCell {
	return style
		? { value, colSpan, style: cellStyle(style) }
		: { value, colSpan };
}
