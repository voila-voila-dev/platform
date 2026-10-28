import { Schema } from "effect";
import { JsonRow } from "#readonly-database/value-objects/json-row";

export const ReadonlyQueryResult = Schema.Struct({
	columns: Schema.Array(Schema.String),
	rows: Schema.Array(JsonRow),
	// The result crossed the adapter's byte cap and was cut.
	truncated: Schema.Boolean,
});
export type ReadonlyQueryResult = typeof ReadonlyQueryResult.Type;
