import {
	type ContentDescendant,
	type ContentNodeLike,
	isContentText,
} from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";

/**
 * Plate's code block, the shape Markdown's fenced code comes back as: one
 * `code_line` per line, the fence's language on the block.
 */
export interface ContentCodeBlockNode extends ContentNodeLike {
	readonly type: "code_block";
	readonly id?: string;
	readonly lang?: string;
}

export interface ContentCodeLineNode extends ContentNodeLike {
	readonly type: "code_line";
}

function lineText(node: ContentDescendant): string {
	return isContentText(node) ? node.text : node.children.map(lineText).join("");
}

/** The code as written: marks mean nothing in code, so they are dropped. */
export function codeBlockText(node: ContentCodeBlockNode): string {
	return node.children.map(lineText).join("\n");
}

function languageClass(lang: string | undefined): string | undefined {
	return lang === undefined || lang === "" ? undefined : `language-${lang}`;
}

export const codeBlockNode: ContentInsertableNodeReader<ContentCodeBlockNode> =
	{
		type: "code_block",
		createNode: (init) => ({
			id: newContentNodeId(),
			type: "code_block",
			children: [{ type: "code_line", children: [{ text: "" }] }],
			...init,
		}),
		Render: ({ node, options }) => (
			<pre
				id={options.idFor?.(node) ?? node.id}
				className={kitClassName(
					options,
					"code_block",
					"overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-sm",
				)}
			>
				<code className={languageClass(node.lang)}>{codeBlockText(node)}</code>
			</pre>
		),
		toHtml: (node, _children, options) =>
			`<pre${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("code_block"))}><code${classAttribute(languageClass(node.lang))}>${escapeHtml(codeBlockText(node))}</code></pre>`,
	};

/** Rendered by its block, which reads the lines itself; here for the registry. */
export const codeLineNode: ContentNodeReader<ContentCodeLineNode> = {
	type: "code_line",
	Render: ({ children }) => children,
	toHtml: (_node, children) => children,
};

export const codeBlockReader = {
	key: "code-block",
	nodes: [codeBlockNode, codeLineNode],
} satisfies ContentFeatureReader;
