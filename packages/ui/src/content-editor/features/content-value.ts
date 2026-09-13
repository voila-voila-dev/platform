/**
 * The document model this editor edits and renders: a Slate tree, kept
 * structural on purpose. Which node kinds exist is the feature registry's
 * business, and a consuming domain declares its own closed schema (derive it
 * with `ContentValueOf<typeof features>`), so this package never owns the
 * shape of anyone's document.
 */
export interface ContentText {
	readonly text: string;
	readonly [mark: string]: unknown;
}

export interface ContentNodeLike {
	readonly type: string;
	readonly children: ReadonlyArray<ContentDescendant>;
	readonly [attribute: string]: unknown;
}

export type ContentDescendant = ContentText | ContentNodeLike;

export type ContentValue = ReadonlyArray<ContentNodeLike>;

export function isContentText(node: ContentDescendant): node is ContentText {
	return typeof (node as ContentText).text === "string";
}
