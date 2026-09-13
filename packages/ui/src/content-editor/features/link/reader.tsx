import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	classAttribute,
	escapeHtml,
} from "#/content-editor/reader/escape-html.ts";

export interface ContentLinkNode extends ContentNodeLike {
	readonly type: "a";
	readonly id?: string;
	readonly url: string;
	readonly title?: string;
}

export const linkNode: ContentInsertableNodeReader<ContentLinkNode> = {
	type: "a",
	kind: "inline",
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "a",
		url: "",
		children: [{ text: "" }],
		...init,
	}),
	Render: ({ node, children, options }) => (
		<a
			href={node.url}
			title={node.title}
			rel="noopener noreferrer"
			className={
				options.classNameFor?.("a") ??
				"text-primary underline underline-offset-2"
			}
		>
			{children}
		</a>
	),
	toHtml: (node, children, options) =>
		`<a href="${escapeHtml(node.url)}"${node.title ? ` title="${escapeHtml(node.title)}"` : ""} rel="noopener noreferrer"${classAttribute(options.classNameFor?.("a"))}>${children}</a>`,
};

export const linkReader = {
	key: "link",
	nodes: [linkNode],
} satisfies ContentFeatureReader;
