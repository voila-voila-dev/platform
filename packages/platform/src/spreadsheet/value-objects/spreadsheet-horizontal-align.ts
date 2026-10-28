import { Schema } from "effect";

export const SpreadsheetHorizontalAlign = Schema.Literals([
	"left",
	"center",
	"right",
]);

export type SpreadsheetHorizontalAlign = typeof SpreadsheetHorizontalAlign.Type;
