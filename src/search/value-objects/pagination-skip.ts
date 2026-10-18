import { Schema } from "effect";

export const PaginationSkip = Schema.Int.check(
	Schema.makeFilter((n: number) => n >= 0 || "PaginationSkip must be >= 0"),
).pipe(Schema.brand("PaginationSkip"));

export type PaginationSkip = typeof PaginationSkip.Type;
