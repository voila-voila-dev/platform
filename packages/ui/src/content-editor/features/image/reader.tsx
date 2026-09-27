import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
} from "#/content-editor/reader/escape-html.ts";

/** How much of the email's width the image takes; `contained` suits a logo or a portrait. */
export type ContentImageSize = "full" | "contained";

/** No email client plays an embedded video, so a video is a thumbnail with a play badge. */
export type ContentImageOverlay = "none" | "play";

export interface ContentImageNode extends ContentNodeLike {
	readonly type: "image";
	readonly id?: string;
	/** Empty while the upload is still running. */
	readonly url: string;
	readonly alt?: string;
	readonly caption?: string;
	/** The file's pixel size, from the upload. */
	readonly width?: number;
	readonly height?: number;
	/** Wraps the image in a link when non-empty. */
	readonly href?: string;
	/** The email block editor's image `width`: `width` here was already the
	 * pixel size. */
	readonly size?: ContentImageSize;
	readonly overlay?: ContentImageOverlay;
}

/** The share of the width a `contained` image takes, the theme's default. */
export const CONTAINED_IMAGE_RATIO = 0.6;

interface MdastImage {
	readonly url: string;
	readonly alt?: string | null;
	readonly title?: string | null;
}

export const imageNode: ContentNodeReader<ContentImageNode> = {
	type: "image",
	kind: "void",
	markdown: {
		deserializeKey: "img",
		serialize: (node) => ({
			type: "paragraph",
			children: [
				{
					type: "image",
					url: node.url,
					alt: node.alt ?? node.caption ?? "",
					title: node.caption ?? null,
				},
			],
		}),
		deserialize: (mdast: MdastImage) => ({
			type: "image",
			url: mdast.url,
			alt: mdast.alt ?? undefined,
			caption: mdast.title ?? undefined,
			children: [{ text: "" }],
		}),
		loss: "width, height, link, size and overlay",
	},
	Render: ({ node, options }) => {
		const size = options.imageDimensions?.get(node.url);
		const image = (
			<img
				src={node.url}
				alt={node.alt ?? node.caption ?? ""}
				width={node.width ?? size?.width}
				height={node.height ?? size?.height}
				loading="lazy"
				className="h-auto w-full rounded-xl border border-border bg-muted"
			/>
		);
		const linked = node.href ? <a href={node.href}>{image}</a> : image;
		return (
			<figure
				id={options.idFor?.(node) ?? node.id}
				className={options.classNameFor?.("image") ?? "flex flex-col gap-1"}
				style={
					node.size === "contained"
						? {
								width: `${CONTAINED_IMAGE_RATIO * 100}%`,
								marginInline: "auto",
							}
						: undefined
				}
			>
				{node.overlay === "play" ? (
					<div className="relative">
						{linked}
						<span
							aria-hidden
							className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 flex size-14 items-center justify-center rounded-full bg-primary"
						>
							<svg
								aria-hidden="true"
								viewBox="0 0 24 24"
								className="size-6 fill-primary-foreground"
							>
								<path d="M8 5v14l11-7z" />
							</svg>
						</span>
					</div>
				) : (
					linked
				)}
				{node.caption ? (
					<figcaption className="text-muted-foreground text-xs italic">
						{node.caption}
					</figcaption>
				) : null}
			</figure>
		);
	},
	toHtml: (node, _children, options) => {
		const size = options.imageDimensions?.get(node.url);
		const width = node.width ?? size?.width;
		const height = node.height ?? size?.height;
		const sizes =
			width !== undefined && height !== undefined
				? ` width="${width}" height="${height}"`
				: "";
		const caption = node.caption
			? `<figcaption>${escapeHtml(node.caption)}</figcaption>`
			: "";
		const img = `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt ?? node.caption ?? "")}"${sizes} loading="lazy">`;
		const linked = node.href
			? `<a href="${escapeHtml(node.href)}">${img}</a>`
			: img;
		const contained =
			node.size === "contained"
				? ` style="width:${CONTAINED_IMAGE_RATIO * 100}%;margin-inline:auto"`
				: "";
		const overlay = node.overlay === "play" ? ' data-overlay="play"' : "";
		return `<figure${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("image"))}${contained}${overlay}>${linked}${caption}</figure>`;
	},
};

export const imageReader = {
	key: "image",
	nodes: [imageNode],
} satisfies ContentFeatureReader;
