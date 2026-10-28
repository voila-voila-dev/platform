import type { ContentEditorApi } from "#/content-editor/features/feature-definition.tsx";
import { linkNode } from "#/content-editor/features/link/reader.tsx";

/**
 * Wraps the selection in a link, or inserts the url as its own text when the
 * selection is collapsed; an existing link at the selection is re-pointed.
 */
export function upsertLink(
	editor: ContentEditorApi,
	{ url, title }: { readonly url: string; readonly title?: string },
) {
	const trimmedUrl = url.trim();
	if (trimmedUrl === "") {
		return;
	}
	const trimmedTitle = title?.trim();
	const attributes = trimmedTitle
		? { url: trimmedUrl, title: trimmedTitle }
		: { url: trimmedUrl };
	const selection = editor.selection;
	if (selection === null || editor.api.isCollapsed()) {
		editor.tf.insertNodes(
			linkNode.createNode({
				...attributes,
				children: [{ text: trimmedUrl }],
			}) as never,
		);
		return;
	}
	editor.tf.wrapNodes(
		linkNode.createNode({ ...attributes, children: [] }) as never,
		{
			at: selection,
			split: true,
		},
	);
	editor.tf.collapse({ edge: "end" });
}

export function removeLink(editor: ContentEditorApi) {
	editor.tf.unwrapNodes({ match: { type: "a" }, split: true });
}
