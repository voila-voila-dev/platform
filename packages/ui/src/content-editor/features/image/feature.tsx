import { ImageIcon } from "@phosphor-icons/react";
import { createPlatePlugin } from "platejs/react";
import type {
	ContentEditorApi,
	ContentFeature,
	ContentItemContext,
} from "#/content-editor/features/feature-definition.tsx";
import { ImageElement } from "#/content-editor/features/image/image-element.tsx";
import { queueImageUpload } from "#/content-editor/features/image/pending-uploads.ts";
import {
	imageNode,
	imageReader,
} from "#/content-editor/features/image/reader.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

export const ImagePlugin = createPlatePlugin({
	key: "image",
	node: { isElement: true, isVoid: true },
});

function insertEmptyImage(editor: ContentEditorApi) {
	insertBlockBelow(editor, imageNode.createNode());
}

/**
 * Dropped or pasted image files: one node per file, inserted at once so the
 * document shows every placeholder, each filled in as its upload lands.
 */
function insertImageFiles(
	editor: ContentEditorApi,
	files: ReadonlyArray<File>,
	{ uploadImage }: ContentItemContext,
) {
	if (uploadImage === null) {
		return;
	}
	const nodes = files.map((file) => {
		const id = newContentNodeId();
		queueImageUpload(id, file);
		return imageNode.createNode({ id });
	});
	editor.tf.insertNodes(nodes as never, { select: true });
}

export const imageFeature: ContentFeature = {
	...imageReader,
	plugins: () => [ImagePlugin],
	components: { image: ImageElement },
	requires: ["upload-image"],
	files: {
		accepts: (file) => file.type.startsWith("image/"),
		insert: insertImageFiles,
	},
	toolbar: [
		{
			key: "image",
			group: "insert",
			icon: ImageIcon,
			label: "image",
			run: insertEmptyImage,
		},
	],
	slash: [
		{
			key: "image",
			icon: ImageIcon,
			label: "image",
			keywords: ["image", "photo", "picture", "upload"],
			run: insertEmptyImage,
		},
	],
};
