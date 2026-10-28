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

export interface ContentXPostNode extends ContentNodeLike {
	readonly type: "x-post";
	readonly id?: string;
	readonly postId: string;
	readonly caption?: string;
}

export function xPostUrl(postId: string): string {
	return `https://x.com/i/status/${encodeURIComponent(postId)}`;
}

/**
 * Rendered as the blockquote X's embed script upgrades in place, so a host
 * that loads `platform.twitter.com/widgets.js` gets the card and one that
 * does not still gets a working link.
 */
export const xPostNode: ContentInsertableNodeReader<ContentXPostNode> = {
	type: "x-post",
	kind: "void",
	markdown: mdxRule<ContentXPostNode>(
		"x-post",
		["postId", "caption"],
		(attributes) => ({
			type: "x-post",
			postId: attributes.postId ?? "",
			caption: attributes.caption,
			children: [{ text: "" }],
		}),
	),
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "x-post",
		postId: "",
		children: [{ text: "" }],
		...init,
	}),
	Render: ({ node, options }) => (
		<blockquote
			id={options.idFor?.(node) ?? node.id}
			className={options.classNameFor?.("x-post") ?? "twitter-tweet"}
		>
			<a href={xPostUrl(node.postId)} rel="noopener noreferrer">
				{node.caption ?? xPostUrl(node.postId)}
			</a>
		</blockquote>
	),
	toHtml: (node, _children, options) =>
		`<blockquote${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("x-post") ?? "twitter-tweet")}><a href="${xPostUrl(node.postId)}" rel="noopener noreferrer">${escapeHtml(node.caption ?? xPostUrl(node.postId))}</a></blockquote>`,
};

export const xPostReader = {
	key: "x-post",
	nodes: [xPostNode],
} satisfies ContentFeatureReader;
