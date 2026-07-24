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
				{ text: "A word " },
				{ text: "bold <b>", bold: true },
				{ text: " and a " },
				{ text: "link", href: "https://acme.dev?a=1&b=2" },
			]),
		).toBe(
			'A word <b>bold &lt;b&gt;</b> and a <a href="https://acme.dev?a=1&amp;b=2">link</a>',
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
					'A word <b>bold</b>, <em>italic</em>, <u>underlined</u> and <a href="https://acme.dev">a link</a>',
				),
			),
		).toEqual([
			{ text: "A word " },
			{ text: "bold", bold: true },
			{ text: ", " },
			{ text: "italic", italic: true },
			{ text: ", " },
			{ text: "underlined", underline: true },
			{ text: " and " },
			{ text: "a link", href: "https://acme.dev" },
		]);
	});

	it("understands style-based marks some browsers emit", () => {
		expect(
			editorElementToTextSpans(
				elementOf('<span style="font-weight:bold">bold</span>'),
			),
		).toEqual([{ text: "bold", bold: true }]);
	});

	it("turns <br> and block wrappers into newlines and drops the trailing one", () => {
		expect(editorElementToTextSpans(elementOf("line 1<br>line 2<br>"))).toEqual(
			[{ text: "line 1\nline 2" }],
		);
		expect(
			editorElementToTextSpans(elementOf("<div>line 1</div><div>line 2</div>")),
		).toEqual([{ text: "line 1\nline 2" }]);
	});

	it("merges adjacent runs with identical marks", () => {
		expect(
			editorElementToTextSpans(elementOf("<b>bo</b><b>ld</b> plain")),
		).toEqual([{ text: "bold", bold: true }, { text: " plain" }]);
	});

	it("round-trips through the editor html", () => {
		const spans = [
			{ text: "A word " },
			{ text: "bold", bold: true },
			{ text: " and " },
			{ text: "an underlined link", underline: true, href: "https://acme.dev" },
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
