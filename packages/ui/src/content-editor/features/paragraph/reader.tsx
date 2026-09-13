import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
	ContentRunWrapper,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	classAttribute,
	idAttribute,
} from "#/content-editor/reader/escape-html.ts";

export type ContentListStyle = "disc" | "decimal";

/**
 * Plate's indent-list model: a list item is a paragraph carrying
 * `listStyleType` and `indent`, not a nested `<ul><li>` tree. The reader
 * turns a run of such paragraphs back into one list.
 */
export interface ContentParagraphNode extends ContentNodeLike {
	readonly type: "p";
	readonly id?: string;
	/** A list item's nesting starts at 1; a plain paragraph's indent at 1 too. */
	readonly indent?: number;
	readonly listStyleType?: ContentListStyle;
	readonly listStart?: number;
}

const listRun: ContentRunWrapper<ContentParagraphNode> = {
	of: (node) =>
		node.listStyleType === "disc" || node.listStyleType === "decimal"
			? node.listStyleType
			: null,
	Render: ({ runKey, first, children }) =>
		runKey === "disc" ? (
			<ul className="flex list-disc flex-col gap-1 pl-5">{children}</ul>
		) : (
			<ol
				className="flex list-decimal flex-col gap-1 pl-5"
				start={
					first.listStart && first.listStart !== 1 ? first.listStart : undefined
				}
			>
				{children}
			</ol>
		),
	toHtml: (runKey, inner, first) => {
		const tag = runKey === "disc" ? "ul" : "ol";
		const start =
			tag === "ol" && first.listStart && first.listStart !== 1
				? ` start="${first.listStart}"`
				: "";
		return `<${tag}${start}>${inner}</${tag}>`;
	},
};

/** A list item's first level is `indent: 1` and sits flush; deeper levels step in. */
function indentLevels(node: ContentParagraphNode): number {
	const indent = node.indent ?? 0;
	return listRun.of(node) !== null ? Math.max(indent - 1, 0) : indent;
}

function indentStyle(node: ContentParagraphNode) {
	const levels = indentLevels(node);
	return levels > 0 ? { paddingLeft: `${levels * 1.5}em` } : undefined;
}

function indentAttribute(node: ContentParagraphNode): string {
	const levels = indentLevels(node);
	return levels > 0 ? ` style="padding-left:${levels * 1.5}em"` : "";
}

export const paragraphNode: ContentInsertableNodeReader<ContentParagraphNode> =
	{
		type: "p",
		indentable: true,
		createNode: (init) => ({
			id: newContentNodeId(),
			type: "p",
			children: [{ text: "" }],
			...init,
		}),
		Render: ({ node, children, options }) =>
			listRun.of(node) !== null ? (
				<li style={indentStyle(node)}>{children}</li>
			) : (
				<p
					id={options.idFor?.(node) ?? node.id}
					className={options.classNameFor?.("p")}
					style={indentStyle(node)}
				>
					{children}
				</p>
			),
		toHtml: (node, children, options) =>
			listRun.of(node) !== null
				? `<li${indentAttribute(node)}>${children}</li>`
				: `<p${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("p"))}${indentAttribute(node)}>${children}</p>`,
		wrapRun: listRun,
	};

export const paragraphReader = {
	key: "paragraph",
	nodes: [paragraphNode],
} satisfies ContentFeatureReader;
