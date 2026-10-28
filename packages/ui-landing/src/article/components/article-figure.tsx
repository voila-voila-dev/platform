import type {
	ContentImageNode,
	ContentNodeReader,
} from "@voila.dev/ui/content-editor/reader";
import { escapeHtml, escapeUrl } from "@voila.dev/ui/content-editor/reader";
import { ARTICLE_ZOOM_ATTRIBUTE } from "#/article/lib/article-zoom.ts";

export interface ArticleFigureOptions {
	/** The `srcset` of an image the host can resize, one candidate per width. */
	readonly srcSet: (src: string) => string | undefined;
	/** How wide the image is drawn, for the browser to pick a candidate. */
	readonly sizes: string;
	/** The name of the button that opens the image full screen. */
	readonly zoomLabel: (alt: string) => string;
}

const FIGURE = "not-prose my-10 flex flex-col gap-3";
const IMAGE = "h-auto w-full rounded-2xl border border-border/60 bg-muted";
const CAPTION = "text-center text-muted-foreground text-sm leading-relaxed";
const ZOOM = "block w-full cursor-zoom-in rounded-2xl";

function responsiveAttributes(
	url: string,
	options: ArticleFigureOptions,
): string {
	const srcSet = options.srcSet(url);
	return srcSet === undefined
		? ""
		: ` srcset="${escapeHtml(srcSet)}" sizes="${escapeHtml(options.sizes)}"`;
}

function sizeAttributes(node: ContentImageNode): string {
	return node.width === undefined || node.height === undefined
		? ""
		: ` width="${node.width}" height="${node.height}"`;
}

function framedHtml(
	node: ContentImageNode,
	image: string,
	zoomLabel: string,
): string {
	return node.href !== undefined && node.href !== ""
		? `<a href="${escapeUrl(node.href)}">${image}</a>`
		: `<button type="button" ${ARTICLE_ZOOM_ATTRIBUTE} aria-label="${escapeHtml(zoomLabel)}" class="${ZOOM}">${image}</button>`;
}

function captionHtml(caption: string | undefined): string {
	return caption === undefined || caption === ""
		? ""
		: `<figcaption class="${CAPTION}">${escapeHtml(caption)}</figcaption>`;
}

function figureHtml(
	node: ContentImageNode,
	options: ArticleFigureOptions,
	id: string | undefined,
): string {
	if (node.url === "") {
		return "";
	}
	const alt = node.alt ?? node.caption ?? "";
	const image = `<img src="${escapeUrl(node.url)}"${responsiveAttributes(node.url, options)} alt="${escapeHtml(alt)}"${sizeAttributes(node)} loading="lazy" decoding="async" class="${IMAGE}">`;
	const idAttribute = id === undefined ? "" : ` id="${escapeHtml(id)}"`;
	return `<figure${idAttribute} class="${FIGURE}">${framedHtml(node, image, options.zoomLabel(alt))}${captionHtml(node.caption)}</figure>`;
}

export function articleFigureNode(
	options: ArticleFigureOptions,
): ContentNodeReader<ContentImageNode> {
	return {
		type: "image",
		kind: "void",
		Render: ({ node, options: html }) => (
			<div
				className="contents"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: figureHtml escapes every value it interpolates and passes its URLs through escapeUrl, and toHtml writes the same markup
				dangerouslySetInnerHTML={{
					__html: figureHtml(node, options, html.idFor?.(node) ?? node.id),
				}}
			/>
		),
		toHtml: (node, _children, html) =>
			figureHtml(node, options, html.idFor?.(node) ?? node.id),
	};
}
