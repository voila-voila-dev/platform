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
	idAttribute,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";

/**
 * A short line the reader cannot miss: a launch, a promo code, a deadline.
 * One bold sentence on a brand-tinted panel; anything longer is a paragraph.
 */
export interface ContentHighlightNode extends ContentNodeLike {
	/** Also the key of Plate's highlight mark (`KEYS.highlight`): safe only
	 * while no feature registers `HighlightPlugin`. */
	readonly type: "highlight";
	readonly id?: string;
	readonly align: ContentAlignment;
}

export const highlightNode: ContentNodeReader<ContentHighlightNode> = {
	type: "highlight",
	markdown: mdxRule<ContentHighlightNode>(
		"highlight",
		["align"],
		(attributes, children) => ({
			type: "highlight",
			align: (attributes.align as ContentAlignment | undefined) ?? "center",
			children,
		}),
		{ withChildren: true },
	),
	Render: ({ node, children, options }) => (
		<p
			id={options.idFor?.(node) ?? node.id}
			className={kitClassName(
				options,
				"highlight",
				"rounded-[10px] bg-primary/10 px-6 py-4 font-bold text-lg text-primary",
			)}
			style={{ textAlign: node.align ?? "center" }}
		>
			{children}
		</p>
	),
	toHtml: (node, children, options) =>
		`<p${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("highlight") ?? "highlight")}${alignStyleAttribute(node.align ?? "center")}><strong>${children}</strong></p>`,
};

export const highlightReader = {
	key: "highlight",
	nodes: [highlightNode],
} satisfies ContentFeatureReader;
