import { Schema } from "effect";

export const Id = Schema.String.check(
	Schema.isPattern(
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu,
	),
).pipe(Schema.brand("Id"));

export type Id = typeof Id.Type;
