import { Schema } from "effect";
import { PaginationSkip } from "#search/value-objects/pagination-skip";
import { PaginationTake } from "#search/value-objects/pagination-take";

export const Pagination = Schema.Struct({
	take: PaginationTake,
	skip: PaginationSkip,
});

export type Pagination = typeof Pagination.Type;
