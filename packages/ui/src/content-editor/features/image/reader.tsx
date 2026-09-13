import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
} from "#/content-editor/reader/escape-html.ts";

export interface ContentImageNode extends ContentNodeLike {
	readonly type: "image";
	readonly id?: string;
	/** Empty while the upload is still running. */
	readonly url: string;
	readonly alt?: string;
	readonly caption?: string;
	readonly width?: number;
	readonly height?: number;
}

interface MdastImage {
	readonly url: string;
	readonly alt?: string | null;
	readonly title?: string | null;
}

export const imageNode: ContentInsertableNodeReader<ContentImageNode> = {
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
		loss: "width and height",
	},
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "image",
		url: "",
		children: [{ text: "" }],
		...init,
	}),
	Render: ({ node, options }) => {
		const size = options.imageDimensions?.get(node.url);
		return (
			<figure
				id={options.idFor?.(node) ?? node.id}
				className={options.classNameFor?.("image") ?? "flex flex-col gap-1"}
			>
				<img
					src={node.url}
					alt={node.alt ?? node.caption ?? ""}
					width={node.width ?? size?.width}
					height={node.height ?? size?.height}
					loading="lazy"
					className="h-auto w-full rounded-xl border border-border bg-muted"
				/>
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
		return `<figure${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("image"))}><img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt ?? node.caption ?? "")}"${sizes} loading="lazy">${caption}</figure>`;
	},
};

export const imageReader = {
	key: "image",
	nodes: [imageNode],
} satisfies ContentFeatureReader;
