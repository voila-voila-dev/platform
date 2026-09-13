import { describe, expect, it } from "vitest";
import {
	emptyContentValue,
	isEmptyContentValue,
} from "#/content-editor/lib/empty-value.ts";

describe("emptyContentValue", () => {
	it("is one empty paragraph", () => {
		expect(emptyContentValue()).toEqual([
			{ type: "p", children: [{ text: "" }] },
		]);
	});
});

describe("isEmptyContentValue", () => {
	it("treats null, no nodes and blank paragraphs as empty", () => {
		expect(isEmptyContentValue(null)).toBe(true);
		expect(isEmptyContentValue([])).toBe(true);
		expect(isEmptyContentValue(emptyContentValue())).toBe(true);
		expect(
			isEmptyContentValue([{ type: "p", children: [{ text: "  " }] }]),
		).toBe(true);
	});

	it("keeps text and void nodes", () => {
		expect(
			isEmptyContentValue([{ type: "p", children: [{ text: "Bonjour" }] }]),
		).toBe(false);
		expect(
			isEmptyContentValue([
				{ type: "image", url: "https://x/y.png", children: [{ text: "" }] },
			]),
		).toBe(false);
	});
});
