import { Schema } from "effect";

export const SpreadsheetColumn = Schema.Struct({
	width: Schema.optional(Schema.Number),
});

export type SpreadsheetColumn = typeof SpreadsheetColumn.Type;
