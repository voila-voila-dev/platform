import { XLogoIcon } from "@phosphor-icons/react";
import { createPlatePlugin } from "platejs/react";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import {
	xPostNode,
	xPostReader,
} from "#/content-editor/features/x-post/reader.tsx";
import { XPostElement } from "#/content-editor/features/x-post/x-post-element.tsx";
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

export const XPostPlugin = createPlatePlugin({
	key: "x-post",
	node: { isElement: true, isVoid: true },
});

function insert(editor: ContentEditorApi) {
	insertBlockBelow(editor, xPostNode.createNode());
}

export const xPostFeature: ContentFeature = {
	...xPostReader,
	components: { "x-post": XPostElement },
	toolbar: [
		{
			key: "xPost",
			group: "insert",
			icon: XLogoIcon,
			label: "xPost",
			run: insert,
		},
	],
	slash: [
		{
			key: "xPost",
			icon: XLogoIcon,
			label: "xPost",
			keywords: ["x", "twitter", "tweet", "post"],
			run: insert,
		},
	],
	plugins: () => [XPostPlugin],
};
