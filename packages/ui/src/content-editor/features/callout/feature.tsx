import { LightbulbIcon } from "@phosphor-icons/react";
import { createPlatePlugin } from "platejs/react";
import { CalloutElement } from "#/content-editor/features/callout/callout-element.tsx";
import {
	calloutNode,
	calloutReader,
} from "#/content-editor/features/callout/reader.tsx";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

export const CalloutPlugin = createPlatePlugin({
	key: "callout",
	node: { isElement: true },
});

function insertCallout(editor: ContentEditorApi) {
	insertBlockBelow(editor, calloutNode.createNode());
}

export const calloutFeature: ContentFeature = {
	...calloutReader,
	plugins: () => [CalloutPlugin],
	components: { callout: CalloutElement },
	toolbar: [
		{
			key: "callout",
			group: "insert",
			icon: LightbulbIcon,
			label: "callout",
			run: insertCallout,
		},
	],
	slash: [
		{
			key: "callout",
			icon: LightbulbIcon,
			label: "callout",
			keywords: ["callout", "note", "tip", "aside"],
			run: insertCallout,
		},
	],
};
