import { Schema } from "effect";
import { SpreadsheetCell } from "#spreadsheet/value-objects/spreadsheet-cell";

export const SpreadsheetRow = Schema.Struct({
	cells: Schema.Array(SpreadsheetCell),
	height: Schema.optional(Schema.Number),
});

export type SpreadsheetRow = typeof SpreadsheetRow.Type;
