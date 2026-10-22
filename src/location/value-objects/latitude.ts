import { Schema } from "effect";

export const Latitude = Schema.Number.check(
	Schema.isGreaterThanOrEqualTo(-90),
	Schema.isLessThanOrEqualTo(90),
).pipe(Schema.brand("Latitude"));

export type Latitude = typeof Latitude.Type;
