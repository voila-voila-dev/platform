import { ElementApi, type Path, PathApi } from "platejs";
import { createPlatePlugin } from "platejs/react";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import { paragraphNode } from "#/content-editor/features/paragraph/reader.tsx";

/** The block void (image, divider, embed) the caret sits in, if any. */
function selectedBlockVoid(editor: ContentEditorApi): Path | null {
	if (editor.selection === null || !editor.api.isCollapsed()) {
		return null;
	}
	const entry = editor.api.above({
		match: (node) =>
			ElementApi.isElement(node) &&
			editor.api.isVoid(node) &&
			editor.api.isBlock(node),
	});
	return entry === undefined ? null : entry[1];
}

function insertParagraph(editor: ContentEditorApi, at: Path) {
	editor.tf.insertNodes(paragraphNode.createNode() as never, {
		at,
		select: true,
	});
}

/**
 * The browser already moves the caret into a block void and out of it with
 * the arrows, and Backspace deletes it. What it cannot do is leave a void
 * that has nothing on the far side, the usual case for an image dropped at
 * the end: the caret stays trapped. There the arrow makes the paragraph it
 * would have landed in. Enter on a void starts a paragraph below it, as it
 * does on any other block.
 */
const VoidNavigationPlugin = createPlatePlugin({
	key: "voidNavigation",
	handlers: {
		onKeyDown: ({ editor, event }) => {
			if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
				return false;
			}
			const path = selectedBlockVoid(editor);
			if (path === null) {
				return false;
			}
			const forward =
				event.key === "Enter" ||
				((event.key === "ArrowDown" || event.key === "ArrowRight") &&
					editor.api.after(path) === undefined);
			const backward =
				(event.key === "ArrowUp" || event.key === "ArrowLeft") &&
				editor.api.before(path) === undefined;
			if (!forward && !backward) {
				return false;
			}
			event.preventDefault();
			insertParagraph(editor, forward ? PathApi.next(path) : path);
			return true;
		},
	},
});

export const voidNavigationFeature: ContentFeature = {
	key: "void-navigation",
	plugins: () => [VoidNavigationPlugin],
	allowIn: (mode) => mode === "block",
};
