import { Schema } from "effect";

export const Screenshot = Schema.Struct({
	png: Schema.Uint8Array,
	width: Schema.Number,
	height: Schema.Number,
});

export type Screenshot = typeof Screenshot.Type;
