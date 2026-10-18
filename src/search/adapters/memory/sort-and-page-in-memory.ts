import { makePagedResult } from "#search/lib/make-paged-result";
import type { PagedResult } from "#search/value-objects/paged-result";
import type { Pagination } from "#search/value-objects/pagination";

export function sortAndPageInMemory<Item>(
	results: ReadonlyArray<Item>,
	sort: {
		readonly sortBy?: keyof Item | undefined;
		readonly sortDirection?: string | undefined;
	},
	pagination: Pagination,
): PagedResult<Item> {
	const sorted = [...results];
	const sortBy = sort.sortBy;
	if (sortBy !== undefined) {
		const direction = sort.sortDirection === "desc" ? -1 : 1;
		sorted.sort((a, b) => {
			const aValue = a[sortBy];
			const bValue = b[sortBy];
			return (Number(aValue > bValue) - Number(aValue < bValue)) * direction;
		});
	}
	const items = sorted.slice(
		pagination.skip,
		pagination.skip + pagination.take,
	);
	return makePagedResult(items, sorted.length, pagination);
}
