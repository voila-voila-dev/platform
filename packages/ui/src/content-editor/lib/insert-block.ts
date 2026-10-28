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

/**
 * The same, taking the place of the empty line it was asked from: typed on
 * an empty line, the slash would otherwise leave that line empty above.
 */
export function insertBlockInPlace(
	editor: ContentEditorApi,
	node: ContentNodeLike,
) {
	const current = editor.api.block();
	const emptyLine =
		current !== undefined &&
		current[0].type === paragraphNode.type &&
		current[0].listStyleType === undefined &&
		editor.api.isEmpty(current[0])
			? current[1]
			: undefined;
	insertBlockBelow(editor, node);
	if (emptyLine !== undefined) {
		editor.tf.removeNodes({ at: emptyLine });
	}
}
