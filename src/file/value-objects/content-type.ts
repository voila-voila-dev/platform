import { Schema } from "effect";

export const ContentType = Schema.String.pipe(
	Schema.check(Schema.isPattern(/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/u)),
	Schema.brand("ContentType"),
);

export type ContentType = typeof ContentType.Type;
