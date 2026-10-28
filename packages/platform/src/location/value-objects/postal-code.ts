import { Schema } from "effect";

// Any country's format: French "75001", UK "SW1A 1AA", Dutch "1011 AB", Polish "00-001"…
export const PostalCode = Schema.String.pipe(
	Schema.check(
		Schema.isPattern(/^[A-Za-z0-9][A-Za-z0-9 -]{0,10}[A-Za-z0-9]$/u),
	),
).pipe(Schema.brand("PostalCode"));

export type PostalCode = typeof PostalCode.Type;
