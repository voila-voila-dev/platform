import type {
	AnyContentNodeReader,
	ContentFeatureReader,
} from "@voila.dev/ui/content-editor/reader";
import { escapeHtml } from "@voila.dev/ui/content-editor/reader";
import {
	type ArticleCalculatorRenderer,
	articleCalculatorNode,
} from "#/article/components/article-calculator.tsx";
import {
	type ArticleCalloutOptions,
	articleCalloutNode,
} from "#/article/components/article-callout.tsx";
import {
	type ArticleChartOptions,
	articleChartNode,
} from "#/article/components/article-chart.tsx";
import {
	type ArticleFigureOptions,
	articleFigureNode,
} from "#/article/components/article-figure.tsx";

export interface ArticleReadersOptions {
	readonly calculator: ArticleCalculatorRenderer;
	readonly callout: ArticleCalloutOptions;
	readonly chart: ArticleChartOptions;
	readonly figure: ArticleFigureOptions;
	/** The name of a heading's own link, the "#" shown on hover. */
	readonly headingAnchor: string;
	/** The name of a table's scrolling frame, which a keyboard can focus. */
	readonly tableRegion: string;
}

const REPLACED_KEYS = new Set(["callout", "image"]);

const ANCHORED_HEADINGS = new Set(["h2", "h3"]);

function withAnchor(
	node: AnyContentNodeReader,
	label: string,
): AnyContentNodeReader {
	return {
		...node,
		toHtml: (heading, children, options, parts) => {
			const id = options.idFor?.(heading) ?? heading.id;
			const anchor =
				typeof id === "string"
					? `<a href="#${escapeHtml(id)}" class="article-anchor" aria-label="${escapeHtml(label)}">#</a>`
					: "";
			return node.toHtml(heading, `${children}${anchor}`, options, parts);
		},
	};
}

function withScrollFrame(
	node: AnyContentNodeReader,
	label: string,
): AnyContentNodeReader {
	return {
		...node,
		toHtml: (table, children, options, parts) =>
			`<div class="article-table" role="region" aria-label="${escapeHtml(label)}" tabindex="0">${node.toHtml(table, children, options, parts)}</div>`,
	};
}

function adaptedNode(
	node: AnyContentNodeReader,
	options: ArticleReadersOptions,
): AnyContentNodeReader {
	if (ANCHORED_HEADINGS.has(node.type)) {
		return withAnchor(node, options.headingAnchor);
	}
	if (node.type === "table") return withScrollFrame(node, options.tableRegion);
	return node;
}

function adapted(
	reader: ContentFeatureReader,
	options: ArticleReadersOptions,
): ContentFeatureReader {
	return {
		...reader,
		nodes: reader.nodes?.map((node) => adaptedNode(node, options)),
	};
}

export function withArticleReaders(
	readers: ReadonlyArray<ContentFeatureReader>,
	options: ArticleReadersOptions,
): ReadonlyArray<ContentFeatureReader> {
	return [
		...readers
			.filter((reader) => !REPLACED_KEYS.has(reader.key))
			.map((reader) => adapted(reader, options)),
		{ key: "callout", nodes: [articleCalloutNode(options.callout)] },
		{ key: "image", nodes: [articleFigureNode(options.figure)] },
		{ key: "chart", nodes: [articleChartNode(options.chart)] },
		{ key: "calculator", nodes: [articleCalculatorNode(options.calculator)] },
	];
}
