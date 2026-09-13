import { MinusIcon } from "@phosphor-icons/react";
import { HorizontalRuleRules } from "@platejs/basic-nodes";
import { HorizontalRulePlugin } from "@platejs/basic-nodes/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import {
	dividerNode,
	dividerReader,
} from "#/content-editor/features/divider/reader.tsx";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

export function DividerElement(props: PlateElementProps) {
	return (
		<PlateElement {...props}>
			<div contentEditable={false} className="py-2">
				<hr className="border-border" />
			</div>
			{props.children}
		</PlateElement>
	);
}

function insertDivider(editor: ContentEditorApi) {
	insertBlockBelow(editor, dividerNode.createNode());
}

export const dividerFeature: ContentFeature = {
	...dividerReader,
	plugins: () => [
		HorizontalRulePlugin.configure({
			inputRules: [HorizontalRuleRules.markdown()],
		}),
	],
	components: { hr: DividerElement },
	toolbar: [
		{
			key: "divider",
			group: "insert",
			icon: MinusIcon,
			label: "divider",
			run: insertDivider,
		},
	],
	slash: [
		{
			key: "divider",
			icon: MinusIcon,
			label: "divider",
			keywords: ["divider", "rule", "separator", "hr"],
			run: insertDivider,
		},
	],
};
