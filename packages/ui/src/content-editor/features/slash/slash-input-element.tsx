import { type PlateElementProps, useEditorRef } from "platejs/react";
import { useCallback } from "react";
import { InlineCombobox } from "#/content-editor/components/inline-combobox.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";

/**
 * The input Plate inserts when the user types `/`: the registry's slash
 * items, matched on the host's labels and on each item's keywords.
 */
export function SlashInputElement(props: PlateElementProps) {
	const editor = useEditorRef();
	const { registry, capabilities, labels, uploadImage } =
		useContentEditorConfig();
	const items = registry.slashItems(capabilities);

	const filter = useCallback(
		(query: string) => {
			const needle = query.trim().toLowerCase();
			return items
				.map((item) => ({
					item,
					label: labels.items[item.label] ?? item.label,
				}))
				.filter(
					({ item, label }) =>
						needle === "" ||
						label.toLowerCase().includes(needle) ||
						item.keywords.some((keyword) =>
							keyword.toLowerCase().includes(needle),
						),
				)
				.map(({ item, label }) => ({ key: item.key, label, icon: item.icon }));
		},
		[items, labels],
	);

	return (
		<InlineCombobox
			plate={props}
			trigger="/"
			filter={filter}
			onPick={(key) => {
				const item = items.find((candidate) => candidate.key === key);
				// Deferred so the slash_input node is gone before the item acts on
				// the paragraph around it.
				setTimeout(() => item?.run(editor, { labels, uploadImage }), 0);
			}}
			placeholder={labels.chrome.slashPlaceholder}
			ariaLabel={labels.chrome.insert}
			empty={labels.chrome.slashEmpty}
			listSlot="content-editor-slash-menu"
		/>
	);
}
