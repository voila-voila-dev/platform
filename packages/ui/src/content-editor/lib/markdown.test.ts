import { describe, expect, it } from "vitest";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import {
	contentFromMarkdown,
	contentToMarkdown,
} from "#/content-editor/lib/markdown.ts";

const features = createContentFeatures();
const toMarkdown = (value: ContentValue) =>
	contentToMarkdown(value, { features });
const fromMarkdown = (markdown: string) =>
	contentFromMarkdown(markdown, { features });

/** Ids are minted on the way in; the round trip compares everything else. */
const withoutIds = (value: ContentValue): ContentValue =>
	JSON.parse(
		JSON.stringify(value, (key, item) => (key === "id" ? undefined : item)),
	);

describe("contentToMarkdown", () => {
	it("writes text, marks, headings, quotes, lists, links, dividers and tables as GFM", () => {
		expect(
			toMarkdown([
				{ type: "h2", children: [{ text: "Titre" }] },
				{
					type: "p",
					children: [
						{ text: "Un " },
						{ text: "mot", bold: true },
						{ text: " et un " },
						{ type: "a", url: "https://x", children: [{ text: "lien" }] },
						{ text: "." },
					],
				},
				{ type: "blockquote", children: [{ text: "Cité" }] },
				{ type: "p", listStyleType: "disc", children: [{ text: "un" }] },
				{ type: "p", listStyleType: "disc", children: [{ text: "deux" }] },
				{ type: "hr", children: [{ text: "" }] },
				{
					type: "table",
					children: [
						{
							type: "tr",
							children: [
								{ type: "th", children: [{ text: "A" }] },
								{ type: "th", children: [{ text: "B" }] },
							],
						},
						{
							type: "tr",
							children: [
								{ type: "td", children: [{ text: "1" }] },
								{ type: "td", children: [{ text: "2" }] },
							],
						},
					],
				},
			]),
		).toBe(
			[
				"## Titre",
				"",
				"Un **mot** et un [lien](https://x).",
				"",
				"> Cité",
				"",
				"* un",
				"* deux",
				"",
				"***",
				"",
				"| A | B |",
				"| - | - |",
				"| 1 | 2 |",
				"",
			].join("\n"),
		);
	});

	it("writes an image with its caption and the custom blocks as MDX elements", () => {
		expect(
			toMarkdown([
				{
					type: "image",
					url: "https://i/1.png",
					alt: "Une photo",
					caption: "Légende",
					children: [{ text: "" }],
				},
				{ type: "callout", icon: "⚠️", children: [{ text: "Attention" }] },
				{
					type: "youtube-video",
					videoId: "abc123def45",
					caption: "Démo",
					children: [{ text: "" }],
				},
				{ type: "x-post", postId: "1234567", children: [{ text: "" }] },
			]),
		).toBe(
			[
				'![Une photo](https://i/1.png "Légende")',
				"",
				'<callout icon="⚠️">',
				"  Attention",
				"</callout>",
				"",
				'<youtube-video videoId="abc123def45" caption="Démo" />',
				"",
				'<x-post postId="1234567" />',
				"",
			].join("\n"),
		);
	});
});

describe("round trip", () => {
	const document: ContentValue = [
		{ type: "h2", children: [{ text: "Titre" }] },
		{
			type: "p",
			children: [
				{ text: "Un " },
				{ text: "mot", bold: true, italic: true },
				{ text: " " },
				{ type: "a", url: "https://x", children: [{ text: "lien" }] },
			],
		},
		{ type: "blockquote", children: [{ text: "Cité" }] },
		{ type: "p", listStyleType: "decimal", children: [{ text: "un" }] },
		{ type: "p", listStyleType: "decimal", children: [{ text: "deux" }] },
		{ type: "hr", children: [{ text: "" }] },
		{
			type: "image",
			url: "https://i/1.png",
			alt: "Une photo",
			caption: "Légende",
			children: [{ text: "" }],
		},
		{ type: "callout", icon: "⚠️", children: [{ text: "Attention" }] },
		{
			type: "youtube-video",
			videoId: "abc123def45",
			caption: "Démo",
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
	];

	it("brings every built-in node back through Markdown", () => {
		const back = withoutIds(fromMarkdown(toMarkdown(document)));
		expect(back.map((node) => node.type)).toEqual(
			document.map((node) => node.type),
		);
		expect(back[6]).toMatchObject({
			type: "image",
			url: "https://i/1.png",
			alt: "Une photo",
			caption: "Légende",
		});
		expect(back[7]).toMatchObject({
			type: "callout",
			icon: "⚠️",
			children: [{ text: "Attention" }],
		});
		expect(back[8]).toMatchObject({
			type: "youtube-video",
			videoId: "abc123def45",
			caption: "Démo",
		});
		expect(back[9]).toMatchObject({ type: "x-post", postId: "1234567" });
		expect(back[11]).toMatchObject({
			type: "file",
			url: "https://f/1.pdf",
			name: "Rapport",
		});
		expect(back[3]).toMatchObject({
			type: "p",
			listStyleType: "decimal",
			children: [{ text: "un" }],
		});
	});

	it("names what Markdown loses: image sizes", () => {
		const back = withoutIds(
			fromMarkdown(
				toMarkdown([
					{
						type: "image",
						url: "https://i/1.png",
						width: 800,
						height: 600,
						children: [{ text: "" }],
					},
				]),
			),
		);
		expect(back[0]).not.toHaveProperty("width");
		expect(
			features.find((feature) => feature.key === "image")?.nodes?.[0]?.markdown
				?.loss,
		).toBe("width and height");
	});

	it("reads plain Markdown a human wrote", () => {
		expect(
			withoutIds(fromMarkdown("# Bonjour\n\nDu texte **gras**.\n\n- a\n- b\n")),
		).toEqual([
			{ type: "h1", children: [{ text: "Bonjour" }] },
			{
				type: "p",
				children: [
					{ text: "Du texte " },
					{ text: "gras", bold: true },
					{ text: "." },
				],
			},
			{
				type: "p",
				listStyleType: "disc",
				indent: 1,
				children: [{ text: "a" }],
			},
			{
				type: "p",
				listStyleType: "disc",
				indent: 1,
				children: [{ text: "b" }],
			},
		]);
	});
});
