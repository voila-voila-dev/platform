import { Schema } from "effect";
import { SpreadsheetSheet } from "#spreadsheet/value-objects/spreadsheet-sheet";

export const SpreadsheetDocument = Schema.Struct({
	sheets: Schema.Array(SpreadsheetSheet),
});

export type SpreadsheetDocument = typeof SpreadsheetDocument.Type;
