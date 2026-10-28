import { describe, expect, it } from "vitest";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import { withUniqueNodeIds } from "#/content-editor/lib/ids.ts";

const counter = () => {
	let next = 0;
	return () => `fresh-${++next}`;
};

describe("withUniqueNodeIds", () => {
	it("keeps the first element with an id and renews the ones repeating it, nested ones included", () => {
		const value: ContentValue = [
			{ id: "a", type: "p", children: [{ text: "One" }] },
			{ id: "a", type: "p", children: [{ text: "Two" }] },
			{
				id: "b",
				type: "blockquote",
				children: [{ id: "a", type: "p", children: [{ text: "Three" }] }],
			},
		];
		expect(withUniqueNodeIds(value, counter())).toEqual([
			{ id: "a", type: "p", children: [{ text: "One" }] },
			{ id: "fresh-1", type: "p", children: [{ text: "Two" }] },
			{
				id: "b",
				type: "blockquote",
				children: [{ id: "fresh-2", type: "p", children: [{ text: "Three" }] }],
			},
		]);
	});

	it("returns the same value when no id repeats, and leaves elements without an id alone", () => {
		const value: ContentValue = [
			{ id: "a", type: "p", children: [{ text: "One" }] },
			{ type: "p", children: [{ text: "Two" }] },
			{ type: "p", children: [{ text: "Three" }] },
		];
		expect(withUniqueNodeIds(value, counter())).toBe(value);
	});

	it("keeps the reference of the branches it did not change", () => {
		const untouched = { id: "b", type: "p", children: [{ text: "Two" }] };
		const value: ContentValue = [
			{ id: "a", type: "p", children: [{ text: "One" }] },
			untouched,
			{ id: "a", type: "p", children: [{ text: "Three" }] },
		];
		expect(withUniqueNodeIds(value, counter())[1]).toBe(untouched);
	});
});
