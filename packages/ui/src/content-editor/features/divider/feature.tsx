import { MinusIcon } from "@phosphor-icons/react";
import { HorizontalRulePlugin } from "@platejs/basic-nodes/react";
import { createRuleFactory } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { VoidFrame } from "#/content-editor/components/void-frame.tsx";
import {
	dividerNode,
	dividerReader,
} from "#/content-editor/features/divider/reader.tsx";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import { paragraphNode } from "#/content-editor/features/paragraph/reader.tsx";
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

export function DividerElement(props: PlateElementProps) {
	return (
		<PlateElement {...props}>
			<VoidFrame className="py-3">
				<hr className="border-border" />
			</VoidFrame>
			{props.children}
		</PlateElement>
	);
}

/**
 * `---` at the start of a block. Plate's own `HorizontalRuleRules` turns the
 * block into the rule without deleting the `--` typed before the trigger,
 * which then lives on hidden inside the void and comes back in every export.
 */
const dashesToDivider = createRuleFactory({
	type: "blockStart",
	match: /^(--|—)$/,
	trigger: "-",
	apply: ({ editor }, match) => {
		editor.tf.delete({ at: match.range });
		editor.tf.setNodes({ type: dividerNode.type });
		editor.tf.insertNodes(paragraphNode.createNode() as never, {
			select: true,
		});
		return true;
	},
});

function insertDivider(editor: ContentEditorApi) {
	insertBlockBelow(editor, dividerNode.createNode());
}

export const dividerFeature: ContentFeature = {
	...dividerReader,
	plugins: () => [
		HorizontalRulePlugin.configure({ inputRules: [dashesToDivider()] }),
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
