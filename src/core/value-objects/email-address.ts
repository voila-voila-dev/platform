import { Schema } from "effect";

export const EmailAddress = Schema.String.pipe(
	Schema.check(
		Schema.isPattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u),
	),
).pipe(Schema.brand("EmailAddress"));

export type EmailAddress = typeof EmailAddress.Type;
