import { Schema, SchemaGetter } from "effect";

const MediaType = Schema.String.pipe(
	Schema.check(Schema.isPattern(/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/u)),
	Schema.brand("ContentType"),
);

// Decoding accepts a raw header (`Text/CSV; charset=utf-8`), so refs stored before the brand still decode; `make` stays strict.
export const ContentType = Schema.String.pipe(
	Schema.decodeTo(MediaType, {
		decode: SchemaGetter.transform((raw) =>
			(raw.split(";")[0] ?? "").trim().toLowerCase(),
		),
		encode: SchemaGetter.passthrough(),
	}),
);

export type ContentType = typeof ContentType.Type;
