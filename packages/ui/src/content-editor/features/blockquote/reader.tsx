import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	classAttribute,
	idAttribute,
} from "#/content-editor/reader/escape-html.ts";

export interface ContentBlockquoteNode extends ContentNodeLike {
	readonly type: "blockquote";
	readonly id?: string;
}

export const blockquoteNode: ContentInsertableNodeReader<ContentBlockquoteNode> =
	{
		type: "blockquote",
		indentable: true,
		createNode: (init) => ({
			id: newContentNodeId(),
			type: "blockquote",
			children: [{ text: "" }],
			...init,
		}),
		Render: ({ node, children, options }) => (
			<blockquote
				id={options.idFor?.(node) ?? node.id}
				className={
					options.classNameFor?.("blockquote") ??
					"border-border border-l-2 pl-3 text-muted-foreground italic"
				}
			>
				{children}
			</blockquote>
		),
		toHtml: (node, children, options) =>
			`<blockquote${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("blockquote"))}>${children}</blockquote>`,
	};

export const blockquoteReader = {
	key: "blockquote",
	nodes: [blockquoteNode],
} satisfies ContentFeatureReader;
