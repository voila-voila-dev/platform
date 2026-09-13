import { PaperclipIcon } from "@phosphor-icons/react";
import { createPlatePlugin } from "platejs/react";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import { FileElement } from "#/content-editor/features/file/file-element.tsx";
import {
	fileNode,
	fileReader,
} from "#/content-editor/features/file/reader.tsx";
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

export const FilePlugin = createPlatePlugin({
	key: "file",
	node: { isElement: true, isVoid: true },
});

function insert(editor: ContentEditorApi) {
	insertBlockBelow(editor, fileNode.createNode());
}

export const fileFeature: ContentFeature = {
	...fileReader,
	components: { file: FileElement },
	toolbar: [
		{
			key: "file",
			group: "insert",
			icon: PaperclipIcon,
			label: "file",
			run: insert,
		},
	],
	slash: [
		{
			key: "file",
			icon: PaperclipIcon,
			label: "file",
			keywords: ["file", "attachment", "download", "pdf"],
			run: insert,
		},
	],
	plugins: () => [FilePlugin],
};
