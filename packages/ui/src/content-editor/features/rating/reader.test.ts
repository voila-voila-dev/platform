import { describe, expect, it } from "vitest";
import { ratingStepHref } from "#/content-editor/features/rating/reader.tsx";

describe("ratingStepHref", () => {
	it("appends the score as a query parameter, keeping the query and the hash", () => {
		expect(ratingStepHref("https://a.example/s", 1)).toBe(
			"https://a.example/s?rating=1",
		);
		expect(ratingStepHref("https://a.example/s?c=7", 4)).toBe(
			"https://a.example/s?c=7&rating=4",
		);
		expect(ratingStepHref("https://a.example/s?c=7#top", 5)).toBe(
			"https://a.example/s?c=7&rating=5#top",
		);
	});
});
