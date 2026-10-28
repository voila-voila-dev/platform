import { type PlateElementProps, useEditorRef } from "platejs/react";
import { useCallback } from "react";
import { InlineCombobox } from "#/content-editor/components/inline-combobox.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";

/**
 * What `{{` opens: the host's variables, matched on their name and label.
 * Picking one puts its chip at the caret. Leaving without a pick gives back
 * what was typed, so a literal `{{` stays possible.
 */
export function VariableInputElement(props: PlateElementProps) {
	const editor = useEditorRef();
	const { variables, labels } = useContentEditorConfig();

	const filter = useCallback(
		(query: string) => {
			const needle = query.trim().toLowerCase();
			return variables
				.map((variable) => ({
					key: variable.name,
					label: variable.label ?? variable.name,
				}))
				.filter(
					(item) =>
						needle === "" ||
						item.key.toLowerCase().includes(needle) ||
						item.label.toLowerCase().includes(needle),
				);
		},
		[variables],
	);

	return (
		<InlineCombobox
			plate={props}
			trigger="{{"
			filter={filter}
			onPick={(name) => {
				editor.tf.insertNodes(
					{ type: "variable", name, children: [{ text: "" }] } as never,
					{ select: true },
				);
				editor.tf.move({ unit: "offset" });
			}}
			onCancel={(cause, query) => {
				if (cause === "backspace") {
					editor.tf.insertText("{");
				} else if (cause === "escape") {
					editor.tf.insertText(`{{${query}`);
				}
			}}
			placeholder={labels.chrome.variablePlaceholder}
			ariaLabel={labels.chrome.insertVariable}
			empty={labels.chrome.variablesEmpty}
			listSlot="content-editor-variable-menu"
		/>
	);
}
