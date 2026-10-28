import type { PagedResult } from "#search/value-objects/paged-result";
import type { Pagination } from "#search/value-objects/pagination";

export function makePagedResult<T>(
	items: ReadonlyArray<T>,
	total: number,
	pagination: Pagination,
): PagedResult<T> {
	return {
		items,
		total,
		take: pagination.take,
		skip: pagination.skip,
		hasMore: pagination.skip + pagination.take < total,
	};
}
