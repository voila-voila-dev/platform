import type { SpreadsheetCellStyle } from "#spreadsheet/value-objects/spreadsheet-cell-style";

export const DEFAULT_SPREADSHEET_CELL_STYLE: SpreadsheetCellStyle = {
	bold: false,
	italic: false,
	fontColor: null,
	fillColor: null,
	align: "left",
	fontSize: 11,
	numberFormat: null,
	border: false,
	wrap: false,
};
