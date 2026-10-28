import { Schema } from "effect";

export const ColumnDescription = Schema.Struct({
	table: Schema.String,
	column: Schema.String,
	type: Schema.String,
	nullable: Schema.Boolean,
});
export type ColumnDescription = typeof ColumnDescription.Type;
