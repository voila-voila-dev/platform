import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentCardImage,
	ContentElementDefaults,
} from "#/content-editor/features/field-definition.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { formatContentDate } from "#/content-editor/lib/dates.ts";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";

/**
 * A blog post or an external resource. The attributes are the email block
 * editor's `article` block, name for name, so a stored campaign converts one
 * to one.
 */
export interface ContentArticleNode extends ContentNodeLike {
	readonly type: "article";
	readonly id?: string;
	readonly title: string;
	readonly description: string;
	readonly image: ContentCardImage;
	readonly author: string;
	/** ISO day (`YYYY-MM-DD`), written in the reader's locale. */
	readonly publishDate: string;
	readonly href: string;
}

export const ARTICLE_DEFAULTS: ContentElementDefaults<ContentArticleNode> = {
	title: "",
	description: "",
	image: { src: "", alt: "" },
	author: "",
	publishDate: "",
	href: "",
};

const DEFAULT_LOCALE = "en-US";

/** The byline, with a separator only when both parts are there. */
export function articleMeta(node: ContentArticleNode, locale: string): string {
	return [node.author, formatContentDate(node.publishDate, locale)]
		.filter((part) => part !== "")
		.join(" · ");
}

export const articleNode: ContentNodeReader<ContentArticleNode> = {
	type: "article",
	kind: "void",
	Render: ({ node: stored, options }) => {
		const node = { ...ARTICLE_DEFAULTS, ...stored };
		const meta = articleMeta(node, options.locale ?? DEFAULT_LOCALE);
		const title = node.href ? <a href={node.href}>{node.title}</a> : node.title;
		return (
			<article
				id={options.idFor?.(node) ?? node.id}
				className={kitClassName(
					options,
					"article",
					"overflow-hidden rounded-xl border border-border bg-card",
				)}
			>
				{node.image.src ? (
					<img
						src={node.image.src}
						alt={node.image.alt}
						loading="lazy"
						className="block h-auto w-full"
					/>
				) : null}
				<div className="flex flex-col gap-2 p-4">
					<h3 className="font-semibold text-lg">{title}</h3>
					{meta ? (
						<p className="text-muted-foreground text-sm">{meta}</p>
					) : null}
					{node.description ? <p>{node.description}</p> : null}
				</div>
			</article>
		);
	},
	toHtml: (stored, _children, options) => {
		const node = { ...ARTICLE_DEFAULTS, ...stored };
		const meta = articleMeta(node, options.locale ?? DEFAULT_LOCALE);
		const title = node.href
			? `<a href="${escapeHtml(node.href)}">${escapeHtml(node.title)}</a>`
			: escapeHtml(node.title);
		const image = node.image.src
			? `<img src="${escapeHtml(node.image.src)}" alt="${escapeHtml(node.image.alt)}" loading="lazy">`
			: "";
		const byline = meta ? `<p>${escapeHtml(meta)}</p>` : "";
		const description = node.description
			? `<p>${escapeHtml(node.description)}</p>`
			: "";
		return `<article${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("article"))}>${image}<h3>${title}</h3>${byline}${description}</article>`;
	},
};

export const articleReader = {
	key: "article",
	nodes: [articleNode],
} satisfies ContentFeatureReader;
