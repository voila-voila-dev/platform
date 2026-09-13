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

export interface ContentVideoNode extends ContentNodeLike {
	readonly type: "video";
	readonly id?: string;
	readonly url: string;
	readonly caption?: string;
}

export const videoNode: ContentInsertableNodeReader<ContentVideoNode> = {
	type: "video",
	kind: "void",
	markdown: mdxRule<ContentVideoNode>(
		"video",
		["url", "caption"],
		(attributes) => ({
			type: "video",
			url: attributes.url ?? "",
			caption: attributes.caption,
			children: [{ text: "" }],
		}),
	),
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "video",
		url: "",
		children: [{ text: "" }],
		...init,
	}),
	Render: ({ node, options }) => (
		<figure
			id={options.idFor?.(node) ?? node.id}
			className={options.classNameFor?.("video") ?? "flex flex-col gap-1"}
		>
			{/* biome-ignore lint/a11y/useMediaCaption: the figcaption is the caption */}
			<video
				src={node.url}
				controls
				className="w-full rounded-xl border border-border bg-muted"
			/>
			{node.caption ? (
				<figcaption className="text-muted-foreground text-xs italic">
					{node.caption}
				</figcaption>
			) : null}
		</figure>
	),
	toHtml: (node, _children, options) =>
		`<figure${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("video"))}><video src="${escapeHtml(node.url)}" controls></video>${node.caption ? `<figcaption>${escapeHtml(node.caption)}</figcaption>` : ""}</figure>`,
};

export const videoReader = {
	key: "video",
	nodes: [videoNode],
} satisfies ContentFeatureReader;
