import { MinusIcon } from "@phosphor-icons/react";
import { HorizontalRulePlugin } from "@platejs/basic-nodes/react";
import { createRuleFactory } from "platejs";
import {
	type ContentDividerNode,
	dividerNode,
} from "#/content-editor/features/divider/reader.tsx";
import { paragraphNode } from "#/content-editor/features/paragraph/reader.tsx";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";

function DividerView() {
	return <hr className="my-2 border-border" />;
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

export const dividerFeature = defineElementFeature<ContentDividerNode>({
	key: "divider",
	kind: "void",
	node: dividerNode,
	fields: [],
	defaults: {},
	view: DividerView,
	insert: {
		icon: MinusIcon,
		keywords: ["divider", "rule", "separator", "hr"],
	},
	plugins: () => [
		HorizontalRulePlugin.configure({ inputRules: [dashesToDivider()] }),
	],
});
