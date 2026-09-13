import { VideoIcon } from "@phosphor-icons/react";
import { createPlatePlugin } from "platejs/react";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import {
	videoNode,
	videoReader,
} from "#/content-editor/features/video/reader.tsx";
import { VideoElement } from "#/content-editor/features/video/video-element.tsx";
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

export const VideoPlugin = createPlatePlugin({
	key: "video",
	node: { isElement: true, isVoid: true },
});

function insert(editor: ContentEditorApi) {
	insertBlockBelow(editor, videoNode.createNode());
}

export const videoFeature: ContentFeature = {
	...videoReader,
	components: { video: VideoElement },
	toolbar: [
		{
			key: "video",
			group: "insert",
			icon: VideoIcon,
			label: "video",
			run: insert,
		},
	],
	slash: [
		{
			key: "video",
			icon: VideoIcon,
			label: "video",
			keywords: ["video", "film", "mp4"],
			run: insert,
		},
	],
	plugins: () => [VideoPlugin],
};
