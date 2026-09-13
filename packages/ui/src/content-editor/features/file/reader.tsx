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

export interface ContentFileNode extends ContentNodeLike {
	readonly type: "file";
	readonly id?: string;
	readonly url: string;
	readonly name: string;
	readonly caption?: string;
}

export const fileNode: ContentInsertableNodeReader<ContentFileNode> = {
	type: "file",
	kind: "void",
	markdown: mdxRule<ContentFileNode>(
		"file",
		["url", "name", "caption"],
		(attributes) => ({
			type: "file",
			url: attributes.url ?? "",
			name: attributes.name ?? "",
			caption: attributes.caption,
			children: [{ text: "" }],
		}),
	),
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "file",
		url: "",
		name: "",
		children: [{ text: "" }],
		...init,
	}),
	Render: ({ node, options }) => (
		<a
			id={options.idFor?.(node) ?? node.id}
			href={node.url}
			download={node.name}
			className={
				options.classNameFor?.("file") ??
				"inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm underline-offset-2 hover:underline"
			}
		>
			{node.name}
		</a>
	),
	toHtml: (node, _children, options) =>
		`<a${idAttribute(options.idFor?.(node) ?? node.id)} href="${escapeHtml(node.url)}" download="${escapeHtml(node.name)}"${classAttribute(options.classNameFor?.("file"))}>${escapeHtml(node.name)}</a>`,
};

export const fileReader = {
	key: "file",
	nodes: [fileNode],
} satisfies ContentFeatureReader;
