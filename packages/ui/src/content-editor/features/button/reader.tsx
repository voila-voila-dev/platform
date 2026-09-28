import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import {
	alignStyleAttribute,
	type ContentAlignment,
	JUSTIFY,
} from "#/content-editor/lib/alignment.ts";
import { mdxRule } from "#/content-editor/lib/mdx-rule.ts";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";
import { cn } from "#/lib/utils.ts";

/** `primary` is the filled brand button, `secondary` the outlined one. */
export type ContentButtonVariant = "primary" | "secondary";

/** A call to action: one link for the whole block. */
export interface ContentButtonNode extends ContentNodeLike {
	readonly type: "button";
	readonly id?: string;
	readonly label: string;
	readonly href: string;
	readonly variant: ContentButtonVariant;
	readonly align: ContentAlignment;
}

export const buttonNode: ContentNodeReader<ContentButtonNode> = {
	type: "button",
	kind: "void",
	markdown: mdxRule<ContentButtonNode>(
		"button",
		["label", "href", "variant", "align"],
		(attributes) => ({
			type: "button",
			label: attributes.label ?? "",
			href: attributes.href ?? "",
			variant:
				(attributes.variant as ContentButtonVariant | undefined) ?? "primary",
			align: (attributes.align as ContentAlignment | undefined) ?? "center",
			children: [{ text: "" }],
		}),
	),
	Render: ({ node, options }) =>
		node.label === "" ? null : (
			<p
				id={options.idFor?.(node) ?? node.id}
				className={kitClassName(options, "button", "flex")}
				style={{ justifyContent: JUSTIFY[node.align ?? "center"] }}
			>
				<a
					href={node.href || undefined}
					className={cn(
						"inline-block rounded-lg border border-primary px-[30px] py-[13px] font-semibold text-[15px] leading-none no-underline",
						node.variant === "secondary"
							? "text-primary"
							: "bg-primary text-primary-foreground",
					)}
				>
					{node.label}
				</a>
			</p>
		),
	toHtml: (node, _children, options) => {
		if (node.label === "") {
			return "";
		}
		const variant = node.variant ?? "primary";
		const href = node.href ? ` href="${escapeHtml(node.href)}"` : "";
		return `<p${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("button"))}${alignStyleAttribute(node.align ?? "center")}><a${href} class="button button-${escapeHtml(variant)}">${escapeHtml(node.label)}</a></p>`;
	},
};

export const buttonReader = {
	key: "button",
	nodes: [buttonNode],
} satisfies ContentFeatureReader;
