import { describe, expect, it } from "vitest";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import {
	collectContentUrls,
	contentToHtml,
	contentToInlineHtml,
} from "#/content-editor/reader/content-to-html.ts";
import { createContentReaders } from "#/content-editor/reader/readers.ts";

const features = createContentReaders();
const html = (value: ContentValue, options = {}) =>
	contentToHtml(value, { features, ...options });

describe("contentToHtml", () => {
	it("escapes text and nests marks outermost first", () => {
		expect(
			html([
				{
					type: "p",
					id: "p1",
					children: [
						{ text: "a <b> & ", bold: true, italic: true },
						{ text: "c", code: true },
					],
				},
			]),
		).toBe(
			'<p id="p1"><strong><em>a &lt;b&gt; &amp; </em></strong><code>c</code></p>',
		);
	});

	it("renders headings, quotes and dividers with their ids", () => {
		expect(
			html([
				{ type: "h2", id: "h", children: [{ text: "Title" }] },
				{ type: "blockquote", id: "q", children: [{ text: "Said" }] },
				{ type: "hr", children: [{ text: "" }] },
			]),
		).toBe('<h2 id="h">Title</h2><blockquote id="q">Said</blockquote><hr>');
	});

	it("groups list items into one list and keeps a start", () => {
		expect(
			html([
				{ type: "p", listStyleType: "disc", children: [{ text: "one" }] },
				{
					type: "p",
					listStyleType: "disc",
					indent: 2,
					children: [{ text: "two" }],
				},
				{ type: "p", children: [{ text: "between" }] },
				{
					type: "p",
					listStyleType: "decimal",
					listStart: 3,
					children: [{ text: "three" }],
				},
			]),
		).toBe(
			'<ul><li>one</li><li style="padding-left:1.5em">two</li></ul><p>between</p><ol start="3"><li>three</li></ol>',
		);
	});

	it("spaces an inline link from the text that follows it", () => {
		expect(
			html([
				{
					type: "p",
					children: [
						{ text: "see " },
						{
							type: "a",
							url: "https://x?a=1&b=2",
							children: [{ text: "here" }],
						},
						{ text: "now" },
					],
				},
			]),
		).toBe(
			'<p>see <a href="https://x?a=1&amp;b=2" rel="noopener noreferrer">here</a> now</p>',
		);
	});

	it("renders the void nodes and reads image sizes from the options", () => {
		const imageDimensions = new Map([
			["https://i/1.png", { width: 800, height: 600 }],
		]);
		expect(
			html(
				[
					{ type: "callout", icon: "💡", children: [{ text: "Tip" }] },
					{
						type: "image",
						url: "https://i/1.png",
						caption: "A cap",
						children: [{ text: "" }],
					},
					{
						type: "youtube-video",
						videoId: "abc123def45",
						children: [{ text: "" }],
					},
					{ type: "x-post", postId: "1234567", children: [{ text: "" }] },
					{ type: "video", url: "https://v/1.mp4", children: [{ text: "" }] },
					{
						type: "file",
						url: "https://f/1.pdf",
						name: "Rapport",
						children: [{ text: "" }],
					},
				],
				{ imageDimensions },
			),
		).toBe(
			'<aside class="callout"><span aria-hidden="true">💡</span><div>Tip</div></aside>' +
				'<figure><img src="https://i/1.png" alt="A cap" width="800" height="600" loading="lazy"><figcaption>A cap</figcaption></figure>' +
				'<figure><iframe src="https://www.youtube-nocookie.com/embed/abc123def45" title="abc123def45" loading="lazy" allowfullscreen></iframe></figure>' +
				'<blockquote class="twitter-tweet"><a href="https://x.com/i/status/1234567" rel="noopener noreferrer">https://x.com/i/status/1234567</a></blockquote>' +
				'<figure><video src="https://v/1.mp4" controls></video></figure>' +
				'<a href="https://f/1.pdf" download="Rapport">Rapport</a>',
		);
	});

	it("renders a table and skips a node no feature owns", () => {
		expect(
			html([
				{
					type: "table",
					children: [
						{
							type: "tr",
							children: [
								{ type: "th", children: [{ text: "H" }] },
								{ type: "td", children: [{ text: "D" }] },
							],
						},
					],
				},
				{ type: "retired", children: [{ text: "gone" }] },
			]),
		).toBe("<table><tbody><tr><th>H</th><td>D</td></tr></tbody></table>");
	});

	it("writes a lone cell paragraph as bare text and heads a table whose first row is header cells", () => {
		const cell = (type: "th" | "td", ...lines: string[]) => ({
			type,
			children: lines.map((line) => ({
				type: "p",
				id: `p-${line}`,
				children: [{ text: line }],
			})),
		});
		expect(
			html([
				{
					type: "table",
					children: [
						{ type: "tr", children: [cell("th", "Name"), cell("th", "Age")] },
						{ type: "tr", children: [cell("td", "Ann"), cell("td", "1", "2")] },
					],
				},
			]),
		).toBe(
			"<table><thead><tr><th>Name</th><th>Age</th></tr></thead>" +
				'<tbody><tr><td>Ann</td><td><p id="p-1">1</p> <p id="p-2">2</p></td></tr></tbody></table>',
		);
	});

	it("wraps list items in a list wherever they sit, not only at the top level", () => {
		expect(
			html([
				{
					type: "blockquote",
					children: [
						{ type: "p", children: [{ text: "Said" }] },
						{ type: "p", listStyleType: "disc", children: [{ text: "a" }] },
						{ type: "p", listStyleType: "disc", children: [{ text: "b" }] },
						{
							type: "p",
							listStyleType: "decimal",
							children: [{ text: "c" }],
						},
					],
				},
			]),
		).toBe(
			"<blockquote><p>Said</p> <ul><li>a</li><li>b</li></ul> <ol><li>c</li></ol></blockquote>",
		);
	});

	it("writes a code block as one escaped <pre>, its language as a class", () => {
		expect(
			html([
				{
					type: "code_block",
					lang: "ts",
					children: [
						{ type: "code_line", children: [{ text: "if (a < b) {" }] },
						{ type: "code_line", children: [{ text: "" }] },
						{ type: "code_line", children: [{ text: '  say("&");' }] },
					],
				},
				{
					type: "code_block",
					children: [{ type: "code_line", children: [{ text: "plain" }] }],
				},
			]),
		).toBe(
			'<pre><code class="language-ts">if (a &lt; b) {\n\n  say(&quot;&amp;&quot;);</code></pre>' +
				"<pre><code>plain</code></pre>",
		);
	});

	it("keeps the referrer on links within the site and drops it on the others", () => {
		const link = (url: string, target?: string) => ({
			type: "p",
			children: [{ type: "a", url, target, children: [{ text: "x" }] }],
		});
		const rels = (siteOrigin?: string) =>
			[
				"/blog/post",
				"#section",
				"../up",
				"?page=2",
				"mailto:a@b.c",
				"https://tries.care/blog",
				"https://www.tries.care/blog",
				"https://example.com",
				"//example.com/x",
			].map((url) =>
				html([link(url)], { siteOrigin }).includes('rel="noopener noreferrer"'),
			);
		expect(rels("https://tries.care")).toEqual([
			false,
			false,
			false,
			false,
			false,
			false,
			true,
			true,
			true,
		]);
		expect(rels()).toEqual([
			false,
			false,
			false,
			false,
			false,
			true,
			true,
			true,
			true,
		]);
		expect(html([link("/in", "_blank")])).toBe(
			'<p><a href="/in" target="_blank" rel="noopener noreferrer">x</a></p>',
		);
	});

	it("lets a host name classes and ids", () => {
		expect(
			html([{ type: "p", id: "x", children: [{ text: "t" }] }], {
				classNameFor: (type: string) => (type === "p" ? "prose-p" : undefined),
				idFor: () => "custom",
			}),
		).toBe('<p id="custom" class="prose-p">t</p>');
	});
});

describe("contentToInlineHtml", () => {
	it("unwraps top-level paragraphs and joins them with a break", () => {
		expect(
			contentToInlineHtml(
				[
					{ type: "p", children: [{ text: "a" }] },
					{ type: "p", children: [{ text: "b", bold: true }] },
				],
				{ features },
			),
		).toBe("a<br><strong>b</strong>");
	});
});

describe("collectContentUrls", () => {
	it("finds image urls anywhere in the tree", () => {
		expect(
			collectContentUrls([
				{ type: "image", url: "https://i/1.png", children: [{ text: "" }] },
				{
					type: "callout",
					icon: "x",
					children: [
						{ type: "image", url: "https://i/2.png", children: [{ text: "" }] },
					],
				},
				{ type: "image", url: "", children: [{ text: "" }] },
			]),
		).toEqual(["https://i/1.png", "https://i/2.png"]);
	});
});
