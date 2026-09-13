import { describe, expect, it } from "vitest";
import {
	MergeInlinePasteFragmentsPlugin,
	mergeInlinePasteFragments,
} from "#/content-editor/features/paste-merge.ts";

describe("mergeInlinePasteFragments", () => {
	const link = (text: string, url = "https://example.com") => ({
		type: "a",
		url,
		children: [{ text }],
	});
	const p = (children: unknown[], extra: Record<string, unknown> = {}) => ({
		type: "p",
		children,
		...extra,
	});

	it("merges <p>text </p><a>link</a><p> more</p> back into one paragraph", () => {
		const fragment = [
			p([{ text: "r click " }]),
			p([link("here")]),
			p([{ text: " to co" }]),
		];
		expect(mergeInlinePasteFragments(fragment)).toEqual([
			p([{ text: "r click " }, link("here"), { text: " to co" }]),
		]);
	});

	it("merges a lone-link paragraph into the preceding paragraph", () => {
		expect(
			mergeInlinePasteFragments([
				p([{ text: "Visit " }]),
				p([link("our site")]),
			]),
		).toEqual([p([{ text: "Visit " }, link("our site")])]);
	});

	it("does not merge unrelated standalone paragraphs", () => {
		const fragment = [
			p([{ text: "First paragraph." }]),
			p([{ text: "Second paragraph." }]),
		];
		expect(mergeInlinePasteFragments(fragment)).toEqual(fragment);
	});

	it("does not merge into a list item or an indented paragraph", () => {
		const listItem = p([{ text: "item " }], { listStyleType: "disc" });
		const indented = p([{ text: "indented " }], { indent: 1 });
		expect(mergeInlinePasteFragments([listItem, p([link("x")])])).toEqual([
			listItem,
			p([link("x")]),
		]);
		expect(mergeInlinePasteFragments([indented, p([link("x")])])).toEqual([
			indented,
			p([link("x")]),
		]);
	});

	it("leaves a heading followed by a lone-link paragraph alone", () => {
		const fragment = [
			{ type: "h2", children: [{ text: "Title" }] },
			p([link("here")]),
		];
		expect(mergeInlinePasteFragments(fragment)).toEqual(fragment);
	});

	it("does not collapse a block after a link-ended paragraph", () => {
		const fragment = [
			p([{ text: "click " }, link("here")]),
			{ type: "h3", children: [{ text: "Section" }] },
		];
		expect(mergeInlinePasteFragments(fragment)).toEqual(fragment);
	});

	it("preserves order when nothing merges", () => {
		const fragment = [
			p([{ text: "one" }]),
			{ type: "h2", children: [{ text: "two" }] },
			p([{ text: "three" }]),
		];
		expect(mergeInlinePasteFragments(fragment)).toEqual(fragment);
	});

	it("leaves a paragraph with several inline links untouched", () => {
		const fragment = [
			p([
				{ text: "Conservation des pièces : 3 ans (relevés cartes " },
				link("carburant", "https://www.dashdoc.com/fr/blog/indexation-gasoil"),
				{ text: ", exports " },
				link("TMS", "https://www.dashdoc.com/fr/tms"),
				{ text: ", cartes grises)." },
			]),
		];
		expect(mergeInlinePasteFragments(fragment)).toEqual(fragment);
	});
});

describe("MergeInlinePasteFragmentsPlugin", () => {
	it("exposes transformFragment under inject.plugins.html.parser, where Plate reads it", () => {
		const plugin = MergeInlinePasteFragmentsPlugin as unknown as {
			inject?: {
				plugins?: { html?: { parser?: { transformFragment?: unknown } } };
			};
		};
		expect(typeof plugin.inject?.plugins?.html?.parser?.transformFragment).toBe(
			"function",
		);
	});
});
