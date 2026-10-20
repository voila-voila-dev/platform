import { Schema } from "effect";

// What the importing domain made of a row; a rejected one says why.
export const ImportRowResult = Schema.Union([
	Schema.Literals(["created", "updated"]),
	Schema.Struct({ rejected: Schema.String }),
]);

export type ImportRowResult = typeof ImportRowResult.Type;
