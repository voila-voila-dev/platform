import {
	type ContentDescendant,
	type ContentValue,
	isContentText,
} from "#/content-editor/features/content-value.ts";

/** Applies `transform` to every text leaf, keeping marks and structure. */
export function mapContentText(
	value: ContentValue,
	transform: (text: string) => string,
): ContentValue {
	const mapNode = (node: ContentDescendant): ContentDescendant =>
		isContentText(node)
			? { ...node, text: transform(node.text) }
			: { ...node, children: node.children.map(mapNode) };
	return value.map((node) => ({
		...node,
		children: node.children.map(mapNode),
	}));
}

const STRAY_LINE_BREAKS = /[\r\n\u2028\u2029]+/g;
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;
const COLLAPSE_SPACES = / {2,}/g;

/**
 * Scrubs text imported from another system: stray line breaks inside a
 * paragraph (which `white-space: pre-wrap` would draw as breaks the caret
 * cannot backspace through), zero-width characters, runs of spaces. Opt-in
 * on a document being migrated, never on one the editor produced.
 */
export function scrubImportedContent(value: ContentValue): ContentValue {
	return mapContentText(value, (text) =>
		text
			.replace(STRAY_LINE_BREAKS, " ")
			.replace(ZERO_WIDTH, "")
			.replace(COLLAPSE_SPACES, " "),
	);
}
