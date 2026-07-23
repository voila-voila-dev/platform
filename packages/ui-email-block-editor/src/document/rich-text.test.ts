// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
	editorElementToTextSpans,
	textSpansToEditorHtml,
	textSpansToPlainText,
} from "#/document/rich-text.ts";

const elementOf = (html: string): HTMLElement => {
	const element = document.createElement("div");
	element.innerHTML = html;
	return element;
};

describe("textSpansToEditorHtml", () => {
	it("wraps the marks and escapes the text", () => {
		expect(
			textSpansToEditorHtml([
				{ text: "Un mot " },
				{ text: "fort <b>", bold: true },
				{ text: " et un " },
				{ text: "lien", href: "https://acme.dev?a=1&b=2" },
			]),
		).toBe(
			'Un mot <b>fort &lt;b&gt;</b> et un <a href="https://acme.dev?a=1&amp;b=2">lien</a>',
		);
	});

	it("renders line breaks as <br>", () => {
		expect(textSpansToEditorHtml([{ text: "a\nb" }])).toBe("a<br>b");
	});
});

describe("editorElementToTextSpans", () => {
	it("reads tags and styles back into marks", () => {
		expect(
			editorElementToTextSpans(
				elementOf(
					'Un mot <b>fort</b>, <em>penché</em>, <u>souligné</u> et <a href="https://acme.dev">un lien</a>',
				),
			),
		).toEqual([
			{ text: "Un mot " },
			{ text: "fort", bold: true },
			{ text: ", " },
			{ text: "penché", italic: true },
			{ text: ", " },
			{ text: "souligné", underline: true },
			{ text: " et " },
			{ text: "un lien", href: "https://acme.dev" },
		]);
	});

	it("understands style-based marks some browsers emit", () => {
		expect(
			editorElementToTextSpans(
				elementOf('<span style="font-weight:bold">gras</span>'),
			),
		).toEqual([{ text: "gras", bold: true }]);
	});

	it("turns <br> and block wrappers into newlines and drops the trailing one", () => {
		expect(
			editorElementToTextSpans(elementOf("ligne 1<br>ligne 2<br>")),
		).toEqual([{ text: "ligne 1\nligne 2" }]);
		expect(
			editorElementToTextSpans(
				elementOf("<div>ligne 1</div><div>ligne 2</div>"),
			),
		).toEqual([{ text: "ligne 1\nligne 2" }]);
	});

	it("merges adjacent runs with identical marks", () => {
		expect(
			editorElementToTextSpans(elementOf("<b>gr</b><b>as</b> fin")),
		).toEqual([{ text: "gras", bold: true }, { text: " fin" }]);
	});

	it("round-trips through the editor html", () => {
		const spans = [
			{ text: "Un mot " },
			{ text: "fort", bold: true },
			{ text: " et " },
			{ text: "un lien souligné", underline: true, href: "https://acme.dev" },
		];

		expect(
			editorElementToTextSpans(elementOf(textSpansToEditorHtml(spans))),
		).toEqual(spans);
	});
});

describe("textSpansToPlainText", () => {
	it("concatenates the runs", () => {
		expect(
			textSpansToPlainText([{ text: "a " }, { text: "b", bold: true }]),
		).toBe("a b");
	});
});
