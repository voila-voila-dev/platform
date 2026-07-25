import { describe, expect, it } from "vitest";
import {
	getPaginationRange,
	PAGINATION_ELLIPSIS,
} from "#/datatable/hooks/use-pagination.ts";

describe("getPaginationRange", () => {
	it("returns an empty range when there are no pages", () => {
		expect(getPaginationRange({ page: 0, pageCount: 0 })).toEqual([]);
	});

	it("lists every page when the range fits without eliding", () => {
		expect(getPaginationRange({ page: 0, pageCount: 7 })).toEqual([
			0, 1, 2, 3, 4, 5, 6,
		]);
	});

	it("elides the tail when the current page is near the start", () => {
		expect(getPaginationRange({ page: 0, pageCount: 10 })).toEqual([
			0,
			1,
			2,
			3,
			4,
			PAGINATION_ELLIPSIS,
			9,
		]);
	});

	it("elides both sides when the current page is in the middle", () => {
		expect(getPaginationRange({ page: 5, pageCount: 10 })).toEqual([
			0,
			PAGINATION_ELLIPSIS,
			4,
			5,
			6,
			PAGINATION_ELLIPSIS,
			9,
		]);
	});

	it("elides the head when the current page is near the end", () => {
		expect(getPaginationRange({ page: 9, pageCount: 10 })).toEqual([
			0,
			PAGINATION_ELLIPSIS,
			5,
			6,
			7,
			8,
			9,
		]);
	});

	it("keeps the window size constant while sliding", () => {
		for (let page = 0; page < 50; page++) {
			expect(getPaginationRange({ page, pageCount: 50 })).toHaveLength(7);
		}
	});

	it("widens the window with siblingCount", () => {
		expect(
			getPaginationRange({ page: 10, pageCount: 20, siblingCount: 2 }),
		).toEqual([
			0,
			PAGINATION_ELLIPSIS,
			8,
			9,
			10,
			11,
			12,
			PAGINATION_ELLIPSIS,
			19,
		]);
	});

	it("keeps extra pages pinned with boundaryCount", () => {
		expect(
			getPaginationRange({ page: 10, pageCount: 20, boundaryCount: 2 }),
		).toEqual([
			0,
			1,
			PAGINATION_ELLIPSIS,
			9,
			10,
			11,
			PAGINATION_ELLIPSIS,
			18,
			19,
		]);
	});
});
