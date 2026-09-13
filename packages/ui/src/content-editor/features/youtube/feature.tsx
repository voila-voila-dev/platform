import { YoutubeLogoIcon } from "@phosphor-icons/react";
import { createPlatePlugin } from "platejs/react";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import {
	youtubeNode,
	youtubeReader,
} from "#/content-editor/features/youtube/reader.tsx";
import { YoutubeElement } from "#/content-editor/features/youtube/youtube-element.tsx";
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

export const YoutubeVideoPlugin = createPlatePlugin({
	key: "youtube-video",
	node: { isElement: true, isVoid: true },
});

function insert(editor: ContentEditorApi) {
	insertBlockBelow(editor, youtubeNode.createNode());
}

export const youtubeFeature: ContentFeature = {
	...youtubeReader,
	components: { "youtube-video": YoutubeElement },
	toolbar: [
		{
			key: "youtube",
			group: "insert",
			icon: YoutubeLogoIcon,
			label: "youtube",
			run: insert,
		},
	],
	slash: [
		{
			key: "youtube",
			icon: YoutubeLogoIcon,
			label: "youtube",
			keywords: ["youtube", "video", "embed"],
			run: insert,
		},
	],
	plugins: () => [YoutubeVideoPlugin],
};
