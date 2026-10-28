import { Schema } from "effect";

export const SpreadsheetImage = Schema.Struct({
	content: Schema.Uint8Array,
	extension: Schema.Literals(["png", "jpeg", "gif"]),
	/** The top-left corner, in zero-based columns and rows; a fraction lands inside a cell. */
	column: Schema.Number,
	row: Schema.Number,
	widthPx: Schema.Number,
	heightPx: Schema.Number,
});

export type SpreadsheetImage = typeof SpreadsheetImage.Type;
