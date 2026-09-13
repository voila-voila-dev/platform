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

export interface ContentCalloutNode extends ContentNodeLike {
	readonly type: "callout";
	readonly id?: string;
	/** An emoji, kept as text so a reader needs no icon font. */
	readonly icon: string;
}

export const DEFAULT_CALLOUT_ICON = "💡";

export const calloutNode: ContentInsertableNodeReader<ContentCalloutNode> = {
	type: "callout",
	markdown: mdxRule<ContentCalloutNode>(
		"callout",
		["icon"],
		(attributes, children) => ({
			type: "callout",
			icon: attributes.icon ?? DEFAULT_CALLOUT_ICON,
			children,
		}),
		{ withChildren: true },
	),
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "callout",
		icon: DEFAULT_CALLOUT_ICON,
		children: [{ text: "" }],
		...init,
	}),
	Render: ({ node, children, options }) => (
		<aside
			id={options.idFor?.(node) ?? node.id}
			className={
				options.classNameFor?.("callout") ??
				"flex gap-3 rounded-md border border-border bg-muted/40 px-3 py-2"
			}
		>
			<span aria-hidden="true" className="text-lg leading-7">
				{node.icon}
			</span>
			<div className="min-w-0 flex-1">{children}</div>
		</aside>
	),
	toHtml: (node, children, options) =>
		`<aside${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("callout") ?? "callout")}><span aria-hidden="true">${escapeHtml(node.icon)}</span><div>${children}</div></aside>`,
};

export const calloutReader = {
	key: "callout",
	nodes: [calloutNode],
} satisfies ContentFeatureReader;
