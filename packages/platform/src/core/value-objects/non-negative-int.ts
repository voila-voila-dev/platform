import { Schema } from "effect";

export const NonNegativeInt = Schema.Int.check(
	Schema.isGreaterThanOrEqualTo(0),
);

export type NonNegativeInt = typeof NonNegativeInt.Type;
