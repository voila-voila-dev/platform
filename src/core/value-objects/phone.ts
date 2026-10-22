import { Schema } from "effect";

export const Phone = Schema.String.pipe(
	Schema.check(Schema.isPattern(/^\+[1-9]\d{7,14}$/u)),
).pipe(Schema.brand("Phone"));

export type Phone = typeof Phone.Type;
