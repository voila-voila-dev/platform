import { createPlatePlugin } from "platejs/react";
import {
	type ContentVariableNode,
	variableNode,
} from "#/content-editor/features/variable/reader.tsx";
import { VariableChip } from "#/content-editor/features/variable/variable-chip.tsx";
import { VariableInputElement } from "#/content-editor/features/variable/variable-input-element.tsx";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";

/**
 * A second `{` right after a first one opens the variable combobox in place
 * of the two braces.
 */
const VariableInputPlugin = createPlatePlugin({
	key: "variable_input",
	node: { isElement: true, isInline: true, isVoid: true },
}).overrideEditor(({ editor, tf: { insertText } }) => ({
	transforms: {
		insertText(text, options) {
			const selection = editor.selection;
			if (
				text !== "{" ||
				options?.at !== undefined ||
				selection === null ||
				!editor.api.isCollapsed()
			) {
				return insertText(text, options);
			}
			const before = editor.api.range("before", selection);
			if (before === undefined || editor.api.string(before) !== "{") {
				return insertText(text, options);
			}
			editor.tf.deleteBackward("character");
			editor.tf.insertNodes(
				{ type: "variable_input", children: [{ text: "" }] } as never,
				{ select: true },
			);
		},
	},
}));

/**
 * A value filled in per recipient, shown as a chip and stored as a node, so
 * a renderer substitutes it and nothing mistakes it for text. Typing `{{`
 * offers the root's `variables`.
 */
const definedVariableFeature = defineElementFeature<ContentVariableNode>({
	key: "variable",
	kind: "void",
	node: variableNode,
	fields: [],
	defaults: { name: "" },
	view: VariableChip,
	plugins: () => [VariableInputPlugin],
});

export const variableFeature = {
	...definedVariableFeature,
	components: {
		...definedVariableFeature.components,
		variable_input: VariableInputElement,
	},
};
