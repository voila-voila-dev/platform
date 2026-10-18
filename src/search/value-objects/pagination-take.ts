import { Schema } from "effect";

export const PaginationTake = Schema.Int.check(
	Schema.isBetween({ minimum: 1, maximum: 100 }),
).pipe(Schema.brand("PaginationTake"));

export type PaginationTake = typeof PaginationTake.Type;
