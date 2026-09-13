import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type { ContentEditorApi } from "#/content-editor/features/feature-definition.tsx";
import { paragraphNode } from "#/content-editor/features/paragraph/reader.tsx";

/**
 * Inserts a block at the selection, or at the end of the document when
 * nothing is selected, followed by an empty paragraph so the caret has
 * somewhere to land after a void.
 */
export function insertBlockBelow(
	editor: ContentEditorApi,
	node: ContentNodeLike,
) {
	editor.tf.insertNodes([node, paragraphNode.createNode()] as never, {
		at: editor.selection === null ? [editor.children.length] : undefined,
		select: true,
	});
}
