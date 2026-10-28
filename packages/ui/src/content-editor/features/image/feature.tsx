import { ImageIcon } from "@phosphor-icons/react";
import type {
	ContentEditorApi,
	ContentItemContext,
} from "#/content-editor/features/feature-definition.tsx";
import { ImageView } from "#/content-editor/features/image/image-view.tsx";
import { queueImageUpload } from "#/content-editor/features/image/pending-uploads.ts";
import {
	type ContentImageNode,
	imageNode,
} from "#/content-editor/features/image/reader.tsx";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";

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
	const [image] = imageFeature.nodes;
	const nodes = files.map((file) => {
		const id = newContentNodeId();
		queueImageUpload(id, file);
		return image.createNode({ id });
	});
	editor.tf.insertNodes(nodes as never, { select: true });
}

export const imageFeature = defineElementFeature<ContentImageNode>({
	key: "image",
	kind: "void",
	node: imageNode,
	fields: [
		{ type: "image", key: "url", label: "file" },
		{ type: "text", key: "alt", label: "alt", description: "altDescription" },
		{ type: "text", key: "caption", label: "caption" },
		{
			type: "url",
			key: "href",
			label: "imageLink",
			description: "imageLinkDescription",
		},
		{
			type: "select",
			key: "size",
			label: "imageSize",
			options: [
				{ value: "full", label: "imageSizeFull" },
				{ value: "contained", label: "imageSizeContained" },
			],
		},
		{
			type: "select",
			key: "overlay",
			label: "imageOverlay",
			description: "imageOverlayPlayDescription",
			options: [
				{ value: "none", label: "imageOverlayNone" },
				{ value: "play", label: "imageOverlayPlay" },
			],
		},
	],
	defaults: { url: "", href: "", size: "full", overlay: "none" },
	view: ImageView,
	insert: {
		icon: ImageIcon,
		keywords: ["image", "photo", "picture", "upload"],
	},
	requires: ["upload-image"],
	files: {
		accepts: (file) => file.type.startsWith("image/"),
		insert: insertImageFiles,
	},
});
