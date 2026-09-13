import { ImageIcon } from "@phosphor-icons/react";
import { createPlatePlugin } from "platejs/react";
import type {
	ContentEditorApi,
	ContentFeature,
	ContentItemContext,
} from "#/content-editor/features/feature-definition.tsx";
import { ImageElement } from "#/content-editor/features/image/image-element.tsx";
import {
	imageNode,
	imageReader,
} from "#/content-editor/features/image/reader.tsx";
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
 * document shows every placeholder, each uploaded and filled in as its
 * upload lands.
 */
function insertImageFiles(
	editor: ContentEditorApi,
	files: ReadonlyArray<File>,
	{ uploadImage }: ContentItemContext,
) {
	if (uploadImage === null) {
		return;
	}
	const nodes = files.map(() => imageNode.createNode());
	editor.tf.insertNodes(nodes as never, { select: true });
	files.forEach((file, index) => {
		const node = nodes[index];
		if (node === undefined) {
			return;
		}
		void uploadImage(file).then((uploaded) => {
			const path = editor.api.findPath(node as never);
			if (path !== undefined) {
				editor.tf.setNodes(
					{
						url: uploaded.url,
						width: uploaded.width,
						height: uploaded.height,
					} as never,
					{ at: path },
				);
			}
		});
	});
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
