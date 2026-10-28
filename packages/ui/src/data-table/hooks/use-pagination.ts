import * as React from "react";

/** Marker emitted by `getPaginationRange` where page numbers are elided. */
export const PAGINATION_ELLIPSIS = "ellipsis";

export type PaginationRangeItem = number | typeof PAGINATION_ELLIPSIS;

export type PaginationRangeOptions = {
	/** Zero-based index of the current page. */
	page: number;
	/** Total number of pages. */
	pageCount: number;
	/** Pages shown on each side of the current page. */
	siblingCount?: number;
	/** Pages always shown at the start and end of the range. */
	boundaryCount?: number;
};

function range(start: number, end: number): number[] {
	return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * Windows a page range into at most
 * `2 * boundaryCount + 2 * siblingCount + 3` items (current page + siblings,
 * both boundaries, and up to two ellipsis markers). Items are zero-based page
 * indexes; render `item + 1` for the visible page number.
 */
export function getPaginationRange({
	page,
	pageCount,
	siblingCount = 1,
	boundaryCount = 1,
}: PaginationRangeOptions): PaginationRangeItem[] {
	if (pageCount <= 0) {
		return [];
	}

	// An ellipsis only ever hides 2+ pages: with windows this small it is
	// cheaper to show every page than to elide one.
	if (pageCount <= 2 * boundaryCount + 2 * siblingCount + 3) {
		return range(0, pageCount - 1);
	}

	const startBoundary = range(0, boundaryCount - 1);
	const endBoundary = range(pageCount - boundaryCount, pageCount - 1);

	// Clamp the sibling window so it always spans the same number of pages,
	// sliding it inward when the current page sits near either boundary.
	const siblingStart = Math.max(
		Math.min(
			page - siblingCount,
			pageCount - boundaryCount - 2 * siblingCount - 2,
		),
		boundaryCount + 1,
	);
	const siblingEnd = siblingStart + 2 * siblingCount;

	return [
		...startBoundary,
		siblingStart > boundaryCount + 1 ? PAGINATION_ELLIPSIS : boundaryCount,
		...range(siblingStart, siblingEnd),
		siblingEnd < pageCount - boundaryCount - 2
			? PAGINATION_ELLIPSIS
			: pageCount - boundaryCount - 1,
		...endBoundary,
	];
}

/** Memoized `getPaginationRange` for render-time use. */
export function usePagination({
	page,
	pageCount,
	siblingCount = 1,
	boundaryCount = 1,
}: PaginationRangeOptions): PaginationRangeItem[] {
	return React.useMemo(
		() => getPaginationRange({ page, pageCount, siblingCount, boundaryCount }),
		[page, pageCount, siblingCount, boundaryCount],
	);
}
