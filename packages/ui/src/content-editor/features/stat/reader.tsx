import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import {
	alignStyleAttribute,
	type ContentAlignment,
} from "#/content-editor/lib/alignment.ts";
import { mdxRule } from "#/content-editor/lib/mdx-rule.ts";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
} from "#/content-editor/reader/escape-html.ts";

/**
 * One key figure with its caption. A row of three is three stats in
 * columns, never a block that lays out its own row.
 */
export interface ContentStatNode extends ContentNodeLike {
	readonly type: "stat";
	readonly id?: string;
	readonly value: string;
	readonly label: string;
	/** Optional: empty renders nothing. */
	readonly description: string;
	readonly align: ContentAlignment;
}

export const statNode: ContentNodeReader<ContentStatNode> = {
	type: "stat",
	kind: "void",
	markdown: mdxRule<ContentStatNode>(
		"stat",
		["value", "label", "description", "align"],
		(attributes) => ({
			type: "stat",
			value: attributes.value ?? "",
			label: attributes.label ?? "",
			description: attributes.description ?? "",
			align: (attributes.align as ContentAlignment | undefined) ?? "center",
			children: [{ text: "" }],
		}),
	),
	Render: ({ node, options }) => (
		<div
			id={options.idFor?.(node) ?? node.id}
			className={options.classNameFor?.("stat") ?? "flex flex-col gap-1"}
			style={{ textAlign: node.align ?? "center" }}
		>
			<strong className="font-bold text-3xl text-primary leading-tight">
				{node.value}
			</strong>
			<span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
				{node.label}
			</span>
			{node.description ? (
				<span className="text-sm">{node.description}</span>
			) : null}
		</div>
	),
	toHtml: (node, _children, options) => {
		const description = node.description
			? `<p class="stat-description">${escapeHtml(node.description)}</p>`
			: "";
		return `<div${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("stat") ?? "stat")}${alignStyleAttribute(node.align ?? "center")}><p class="stat-value"><strong>${escapeHtml(node.value)}</strong></p><p class="stat-label">${escapeHtml(node.label)}</p>${description}</div>`;
	},
};

export const statReader = {
	key: "stat",
	nodes: [statNode],
} satisfies ContentFeatureReader;
