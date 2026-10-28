import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { mdxRule } from "#/content-editor/lib/mdx-rule.ts";
import {
	classAttribute,
	idAttribute,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";

/**
 * The small print at the foot of an email: offer conditions, validity dates,
 * disclaimers. Rich text, so the conditions can link to the terms.
 */
export interface ContentFinePrintNode extends ContentNodeLike {
	readonly type: "fine-print";
	readonly id?: string;
}

export const finePrintNode: ContentNodeReader<ContentFinePrintNode> = {
	type: "fine-print",
	markdown: mdxRule<ContentFinePrintNode>(
		"fine-print",
		[],
		(_attributes, children) => ({ type: "fine-print", children }),
		{ withChildren: true },
	),
	Render: ({ node, children, options }) => (
		<p
			id={options.idFor?.(node) ?? node.id}
			className={kitClassName(
				options,
				"fine-print",
				"text-center text-muted-foreground text-xs leading-normal",
			)}
		>
			<small>{children}</small>
		</p>
	),
	toHtml: (node, children, options) =>
		`<p${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("fine-print") ?? "fine-print")}><small>${children}</small></p>`,
};

export const finePrintReader = {
	key: "finePrint",
	nodes: [finePrintNode],
} satisfies ContentFeatureReader;
