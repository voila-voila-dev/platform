import { Schema } from "effect";

export const SpreadsheetCellValue = Schema.NullOr(
	Schema.Union([Schema.String, Schema.Number]),
);

export type SpreadsheetCellValue = typeof SpreadsheetCellValue.Type;
