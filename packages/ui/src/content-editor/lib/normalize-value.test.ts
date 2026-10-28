import { describe, expect, it } from "vitest";
import {
	mapContentText,
	scrubImportedContent,
} from "#/content-editor/lib/normalize-value.ts";

describe("mapContentText", () => {
	it("reaches nested leaves and keeps marks", () => {
		const value = [
			{
				type: "p",
				children: [
					{ text: "a", bold: true },
					{ type: "a", url: "https://x", children: [{ text: "b" }] },
				],
			},
		];
		expect(mapContentText(value, (text) => text.toUpperCase())).toEqual([
			{
				type: "p",
				children: [
					{ text: "A", bold: true },
					{ type: "a", url: "https://x", children: [{ text: "B" }] },
				],
			},
		]);
	});
});

describe("scrubImportedContent", () => {
	it("turns line breaks into spaces, drops zero-widths and collapses runs", () => {
		const value = [
			{
				type: "p",
				children: [
					{ text: "one\r\ntwo\u2028three\u200B   four", italic: true },
				],
			},
		];
		expect(scrubImportedContent(value)).toEqual([
			{
				type: "p",
				children: [{ text: "one two three four", italic: true }],
			},
		]);
	});
});
