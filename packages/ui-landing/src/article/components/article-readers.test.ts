import {
	type ContentValue,
	contentToHtml,
	createContentReaders,
} from "@voila.dev/ui/content-editor/reader";
import { describe, expect, it } from "vitest";
import {
	type ArticleReadersOptions,
	withArticleReaders,
} from "#/article/components/article-readers.tsx";

const options: ArticleReadersOptions = {
	calculator: {
		kinds: ["heart-rate"],
		Render: () => null,
		toHtml: ({ kind, id }) =>
			`<div data-calculator="${kind}" data-id="${id ?? ""}"></div>`,
	},
	callout: {
		labels: {
			summary: "In short",
			info: "Good to know",
			tip: "Tip",
			warning: "Warning",
			danger: "Danger",
		},
	},
	chart: {
		labels: {
			asOf: (isoDate) => `Figures as of ${isoDate}`,
			source: "Source:",
			showData: "Show the data",
			total: "Total",
			plot: (title) => `Chart: ${title}`,
		},
		locale: "fr-FR",
	},
	figure: {
		srcSet: (src) => `${src}?w=480 480w, ${src}?w=800 800w`,
		sizes: "100vw",
		zoomLabel: (alt) => `Enlarge the image: ${alt}`,
	},
	headingAnchor: "Link to this section",
	tableRegion: "Scrolling table",
};

const readers = withArticleReaders(createContentReaders(), options);

function html(body: ContentValue): string {
	return contentToHtml(body, { features: readers });
}

function paragraph(text: string) {
	return { type: "p", children: [{ text }] };
}

const orderPrice = {
	type: "stackedBar",
	title: "What an order costs",
	unit: "€",
	categories: ["A 4-hour job"],
	series: [
		{ label: "Paid to the contractor", values: [160] },
		{ label: "Fixed fees", values: [6.9] },
	],
	asOf: "2026-10-05",
	source: { label: "Acme price list", url: "https://acme.example/prices" },
};

describe("article callouts", () => {
	it("names a danger box by its kind and title, in words as well as colour", () => {
		const printed = html([
			{
				type: "callout",
				variant: "danger",
				title: "Stop the machine if…",
				children: [paragraph("The belt slips.")],
			},
		]);
		expect(printed).toContain(
			'role="note" aria-label="Danger: Stop the machine if…" data-variant="danger"',
		);
		expect(printed).toContain(">Danger</span>");
		expect(printed).toContain("<p>The belt slips.</p>");
	});

	it("prints a title that only repeats the label once", () => {
		const printed = html([
			{
				type: "callout",
				variant: "summary",
				title: "In short.",
				children: [paragraph("A job costs about 130 €.")],
			},
		]);
		expect(printed).toContain('aria-label="In short" data-variant="summary"');
		expect(printed.match(/In short/gu)?.length).toBe(2);
	});

	it("reads a callout the kit stored, emoji and no variant, as a note", () => {
		const printed = html([
			{ type: "callout", icon: "💡", children: [{ text: "Worth knowing" }] },
		]);
		expect(printed).toContain('aria-label="Good to know" data-variant="info"');
		expect(printed).not.toContain("💡");
	});
});

describe("article callouts with a host's own variant names", () => {
	it("reads them through variantOf", () => {
		const legacy = withArticleReaders(createContentReaders(), {
			...options,
			callout: {
				...options.callout,
				variantOf: (value) => (value === "urgence" ? "danger" : "info"),
			},
		});
		expect(
			contentToHtml(
				[{ type: "callout", variant: "urgence", children: [paragraph("!")] }],
				{ features: legacy },
			),
		).toContain('data-variant="danger"');
	});
});

describe("article charts", () => {
	it("prints the figures, their table, their date and their source", () => {
		const printed = html([
			{ type: "chart", chart: orderPrice, children: [{ text: "" }] },
		]);
		expect(printed).toContain(">What an order costs</figcaption>");
		expect(printed).toContain('role="img" aria-label="Chart: What an order');
		expect(printed).toContain(">A 4-hour job</th>");
		expect(printed).toContain("166,9\u00a0€");
		expect(printed).toContain("Figures as of 2026-10-05 · Source: ");
		expect(printed).toContain('href="https://acme.example/prices"');
	});

	it("prints nothing for figures that do not line up", () => {
		expect(
			html([
				{
					type: "chart",
					chart: { ...orderPrice, categories: ["A", "B"] },
					children: [{ text: "" }],
				},
			]),
		).toBe("");
	});
});

describe("article calculators", () => {
	it("hands a known kind and its anchor to the host", () => {
		expect(
			html([
				{
					type: "calculator",
					kind: "heart-rate",
					id: "calculator",
					children: [{ text: "" }],
				},
			]),
		).toBe('<div data-calculator="heart-rate" data-id="calculator"></div>');
	});

	it("prints nothing for a kind the site cannot draw", () => {
		expect(
			html([{ type: "calculator", kind: "pace", children: [{ text: "" }] }]),
		).toBe("");
	});
});

describe("article figures, headings and tables", () => {
	it("draws an image as a lazy, captioned figure in every width", () => {
		expect(
			html([
				{
					type: "image",
					url: "/media/content-image/a.webp",
					alt: "A strapping",
					caption: "The strapping before the match",
					width: 1200,
					height: 800,
					children: [{ text: "" }],
				},
			]),
		).toBe(
			'<figure class="not-prose my-10 flex flex-col gap-3"><button type="button" data-article-zoom aria-label="Enlarge the image: A strapping" class="block w-full cursor-zoom-in rounded-2xl"><img src="/media/content-image/a.webp" srcset="/media/content-image/a.webp?w=480 480w, /media/content-image/a.webp?w=800 800w" sizes="100vw" alt="A strapping" width="1200" height="800" loading="lazy" decoding="async" class="h-auto w-full rounded-2xl border border-border/60 bg-muted"></button><figcaption class="text-center text-muted-foreground text-sm leading-relaxed">The strapping before the match</figcaption></figure>',
		);
	});

	it("links a heading to itself and frames a table that may scroll", () => {
		expect(
			html([
				{ type: "h2", id: "prices", children: [{ text: "Prices" }] },
				{
					type: "table",
					children: [
						{
							type: "tr",
							children: [{ type: "td", children: [paragraph("90 €")] }],
						},
					],
				},
			]),
		).toBe(
			'<h2 id="prices">Prices<a href="#prices" class="article-anchor" aria-label="Link to this section">#</a></h2><div class="article-table" role="region" aria-label="Scrolling table" tabindex="0"><table><tbody><tr><td>90 €</td></tr></tbody></table></div>',
		);
	});
});
