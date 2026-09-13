import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import { mdxRule } from "#/content-editor/lib/mdx-rule.ts";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
} from "#/content-editor/reader/escape-html.ts";

export interface ContentYoutubeNode extends ContentNodeLike {
	readonly type: "youtube-video";
	readonly id?: string;
	readonly videoId: string;
	readonly caption?: string;
}

export function youtubeEmbedUrl(videoId: string): string {
	return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
}

export const youtubeNode: ContentInsertableNodeReader<ContentYoutubeNode> = {
	type: "youtube-video",
	kind: "void",
	markdown: mdxRule<ContentYoutubeNode>(
		"youtube-video",
		["videoId", "caption"],
		(attributes) => ({
			type: "youtube-video",
			videoId: attributes.videoId ?? "",
			caption: attributes.caption,
			children: [{ text: "" }],
		}),
	),
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "youtube-video",
		videoId: "",
		children: [{ text: "" }],
		...init,
	}),
	Render: ({ node, options }) => (
		<figure
			id={options.idFor?.(node) ?? node.id}
			className={
				options.classNameFor?.("youtube-video") ?? "flex flex-col gap-1"
			}
		>
			<iframe
				title={node.caption ?? node.videoId}
				src={youtubeEmbedUrl(node.videoId)}
				loading="lazy"
				allowFullScreen
				className="aspect-video w-full rounded-xl border border-border"
			/>
			{node.caption ? (
				<figcaption className="text-muted-foreground text-xs italic">
					{node.caption}
				</figcaption>
			) : null}
		</figure>
	),
	toHtml: (node, _children, options) =>
		`<figure${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("youtube-video"))}><iframe src="${youtubeEmbedUrl(node.videoId)}" title="${escapeHtml(node.caption ?? node.videoId)}" loading="lazy" allowfullscreen></iframe>${node.caption ? `<figcaption>${escapeHtml(node.caption)}</figcaption>` : ""}</figure>`,
};

export const youtubeReader = {
	key: "youtube",
	nodes: [youtubeNode],
} satisfies ContentFeatureReader;
