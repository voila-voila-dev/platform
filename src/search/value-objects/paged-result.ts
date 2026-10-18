import { Schema } from "effect";
import { PaginationSkip } from "#search/value-objects/pagination-skip";
import { PaginationTake } from "#search/value-objects/pagination-take";

export function PagedResult<I extends Schema.Top>(item: I) {
	return Schema.Struct({
		items: Schema.Array(item),
		total: Schema.Number,
		take: PaginationTake,
		skip: PaginationSkip,
		hasMore: Schema.Boolean,
	});
}

export interface PagedResult<T> {
	readonly items: ReadonlyArray<T>;
	readonly total: number;
	readonly take: PaginationTake;
	readonly skip: PaginationSkip;
	readonly hasMore: boolean;
}
