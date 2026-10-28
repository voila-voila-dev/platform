import { Schema } from "effect";
import { SpreadsheetCellStyle } from "#spreadsheet/value-objects/spreadsheet-cell-style";
import { SpreadsheetCellValue } from "#spreadsheet/value-objects/spreadsheet-cell-value";

export const SpreadsheetCell = Schema.Struct({
	value: SpreadsheetCellValue,
	style: Schema.optional(SpreadsheetCellStyle),
	colSpan: Schema.optional(Schema.Number),
});

export type SpreadsheetCell = typeof SpreadsheetCell.Type;
