import { Schema } from "effect";
import { SpreadsheetHorizontalAlign } from "#spreadsheet/value-objects/spreadsheet-horizontal-align";

export const SpreadsheetCellStyle = Schema.Struct({
	bold: Schema.Boolean,
	italic: Schema.Boolean,
	/** RRGGBB, or AARRGGBB. */
	fontColor: Schema.NullOr(Schema.String),
	fillColor: Schema.NullOr(Schema.String),
	align: SpreadsheetHorizontalAlign,
	fontSize: Schema.Number,
	/** An Excel number format, such as `#,##0.00 €`. */
	numberFormat: Schema.NullOr(Schema.String),
	border: Schema.Boolean,
	wrap: Schema.Boolean,
});

export type SpreadsheetCellStyle = typeof SpreadsheetCellStyle.Type;
