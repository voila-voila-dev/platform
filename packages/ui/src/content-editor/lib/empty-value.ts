import {
	type ContentValue,
	isContentText,
} from "#/content-editor/features/content-value.ts";

/** One empty paragraph: what Slate needs to place a caret at all. */
export function emptyContentValue(): ContentValue {
	return [{ type: "p", children: [{ text: "" }] }];
}

/** True when the document carries no text and no void node (an image, an embed). */
export function isEmptyContentValue(value: ContentValue | null): boolean {
	if (value === null || value.length === 0) {
		return true;
	}
	return value.every(
		(node) =>
			node.type === "p" &&
			node.children.every(
				(child) => isContentText(child) && child.text.trim() === "",
			),
	);
}
