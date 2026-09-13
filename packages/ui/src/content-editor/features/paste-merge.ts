import { createPlatePlugin } from "platejs/react";

/**
 * Pasted HTML from Slack, Gmail and many sites puts a bare `<a>` between
 * block paragraphs: `<p>text </p><a>link</a><p> more</p>`. Plate's
 * normalizer wraps that orphan link in a paragraph of its own, so one
 * sentence lands as three stacked paragraphs. This `transformFragment` runs
 * after deserialization and joins them back: a lone-link paragraph merges
 * into the paragraph before it, and a plain paragraph merges into a
 * paragraph that now ends with that link.
 */
type InlineLeaf =
	| { text: string }
	| { type: string; children: InlineLeaf[]; [key: string]: unknown };
type ParagraphLike = {
	type: string;
	children: InlineLeaf[];
	listStyleType?: unknown;
	indent?: unknown;
	[key: string]: unknown;
};

function isMergeableParagraph(node: unknown): node is ParagraphLike {
	if (!node || typeof node !== "object") {
		return false;
	}
	const paragraph = node as ParagraphLike;
	return (
		paragraph.type === "p" &&
		!paragraph.listStyleType &&
		!paragraph.indent &&
		Array.isArray(paragraph.children)
	);
}

function isLoneLinkParagraph(node: unknown): node is ParagraphLike {
	return (
		isMergeableParagraph(node) &&
		node.children.length === 1 &&
		(node.children[0] as { type?: string })?.type === "a"
	);
}

function endsWithInlineLink(node: ParagraphLike): boolean {
	const last = node.children[node.children.length - 1] as
		| { type?: string }
		| undefined;
	return last?.type === "a";
}

function isInlineOnlyParagraph(node: unknown): node is ParagraphLike {
	return (
		isMergeableParagraph(node) &&
		node.children.every(
			(child) => "text" in child || (child as { type?: string }).type === "a",
		)
	);
}

export function mergeInlinePasteFragments<T>(fragment: ReadonlyArray<T>): T[] {
	const result: unknown[] = [];
	for (const node of fragment) {
		const previous = result[result.length - 1];
		if (isLoneLinkParagraph(node) && isMergeableParagraph(previous)) {
			previous.children = [...previous.children, ...node.children];
			continue;
		}
		if (
			isMergeableParagraph(previous) &&
			endsWithInlineLink(previous) &&
			isInlineOnlyParagraph(node)
		) {
			previous.children = [...previous.children, ...node.children];
			continue;
		}
		result.push({ ...(node as object) });
	}
	return result as T[];
}

/**
 * `transformFragment` only fires for plugins injected into the active
 * deserializer (`html`); a top-level `parser.transformFragment` is ignored
 * by Plate's `ParserPlugin`, which reads `getInjectedPlugins(editor, htmlPlugin)`.
 */
export const MergeInlinePasteFragmentsPlugin = createPlatePlugin({
	key: "merge-inline-paste-fragments",
	inject: {
		plugins: {
			html: {
				parser: {
					transformFragment: ({ fragment }) =>
						mergeInlinePasteFragments(fragment),
				},
			},
		},
	},
});
