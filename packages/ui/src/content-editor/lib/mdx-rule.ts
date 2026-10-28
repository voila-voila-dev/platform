import {
	type ContentDescendant,
	type ContentNodeLike,
	isContentText,
} from "#/content-editor/features/content-value.ts";
import type { ContentMarkdownRule } from "#/content-editor/features/reader-definition.tsx";

interface MdxAttribute {
	readonly type: "mdxJsxAttribute";
	readonly name: string;
	readonly value: string;
}

interface MdxElement {
	readonly type: "mdxJsxFlowElement";
	readonly name: string;
	readonly attributes: ReadonlyArray<MdxAttribute>;
	readonly children: ReadonlyArray<unknown>;
}

/**
 * An MDX flow element holds blocks, so its text comes back wrapped in
 * paragraphs; a node of ours that holds inline text gets the paragraphs'
 * children back, one line per paragraph.
 */
function inlineChildren(
	children: ReadonlyArray<ContentDescendant>,
): ReadonlyArray<ContentDescendant> {
	if (!children.every((child) => !isContentText(child) && child.type === "p")) {
		return children;
	}
	return children.flatMap((paragraph, index) =>
		index === 0
			? [...(paragraph as ContentNodeLike).children]
			: [{ text: "\n" }, ...(paragraph as ContentNodeLike).children],
	);
}

/**
 * A node Markdown has no words for crosses as an MDX element named after
 * its type, its attributes as JSX attributes: `<youtube-video videoId="…" />`.
 * A plain-Markdown reader sees the tag text; an MDX one gets the node back.
 */
export function mdxRule<N extends ContentNodeLike>(
	type: N["type"],
	attributes: ReadonlyArray<Exclude<keyof N & string, "type" | "children">>,
	build: (
		attributes: Readonly<Record<string, string>>,
		children: N["children"],
	) => N,
	options: { readonly withChildren?: boolean; readonly loss?: string } = {},
): ContentMarkdownRule<N> {
	return {
		serialize: (node, context) => ({
			type: "mdxJsxFlowElement",
			name: type,
			attributes: attributes.flatMap((name) => {
				const value = node[name];
				return value === undefined || value === null || value === ""
					? []
					: [{ type: "mdxJsxAttribute", name, value: String(value) }];
			}),
			children: options.withChildren ? context.serializeChildren(node) : [],
		}),
		deserialize: (mdast: MdxElement, context) =>
			build(
				Object.fromEntries(
					mdast.attributes
						.filter((attribute) => attribute.type === "mdxJsxAttribute")
						.map((attribute) => [attribute.name, attribute.value]),
				),
				options.withChildren
					? inlineChildren(context.deserializeChildren(mdast))
					: [{ text: "" }],
			),
		loss: options.loss,
	};
}
