import { Schema } from "effect";

export const Longitude = Schema.Number.check(
	Schema.isGreaterThanOrEqualTo(-180),
	Schema.isLessThanOrEqualTo(180),
).pipe(Schema.brand("Longitude"));

export type Longitude = typeof Longitude.Type;
