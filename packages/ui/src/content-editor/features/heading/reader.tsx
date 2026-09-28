import { createElement } from "react";
import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	classAttribute,
	idAttribute,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";

export type ContentHeadingLevel = "h1" | "h2" | "h3" | "h4";

export interface ContentHeadingNode<
	Level extends ContentHeadingLevel = ContentHeadingLevel,
> extends ContentNodeLike {
	readonly type: Level;
	readonly id?: string;
}

const headingClassName: Record<ContentHeadingLevel, string> = {
	h1: "font-bold text-2xl leading-tight",
	h2: "font-semibold text-xl leading-tight",
	h3: "font-semibold text-lg leading-snug",
	h4: "font-semibold text-base",
};

function headingNode<Level extends ContentHeadingLevel>(
	level: Level,
): ContentNodeReader<ContentHeadingNode<Level>> {
	return {
		type: level,
		indentable: true,
		createNode: (init) => ({
			id: newContentNodeId(),
			type: level,
			children: [{ text: "" }],
			...init,
		}),
		Render: ({ node, children, options }) =>
			createElement(
				level,
				{
					id: options.idFor?.(node) ?? node.id,
					className: kitClassName(options, level, headingClassName[level]),
				},
				children,
			),
		toHtml: (node, children, options) =>
			`<${level}${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.(level))}>${children}</${level}>`,
	};
}

/** The body editor offers `h1` only when asked: a page owns its title, an
 * email carries its own. */
export function headingReader(levels: ReadonlyArray<ContentHeadingLevel>) {
	return {
		key: "heading",
		nodes: levels.map((level) => headingNode(level)),
	} satisfies ContentFeatureReader;
}
