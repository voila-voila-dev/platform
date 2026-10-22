import { Schema } from "effect";
import { SpreadsheetColumn } from "#spreadsheet/value-objects/spreadsheet-column";
import { SpreadsheetImage } from "#spreadsheet/value-objects/spreadsheet-image";
import { SpreadsheetRow } from "#spreadsheet/value-objects/spreadsheet-row";

export const SpreadsheetSheet = Schema.Struct({
	name: Schema.String,
	columns: Schema.optional(Schema.Array(SpreadsheetColumn)),
	rows: Schema.Array(SpreadsheetRow),
	freezeRows: Schema.optional(Schema.Number),
	/** Drawn over the cells: a logo leaves room for itself with an empty or taller row. */
	images: Schema.optional(Schema.Array(SpreadsheetImage)),
});

export type SpreadsheetSheet = typeof SpreadsheetSheet.Type;
