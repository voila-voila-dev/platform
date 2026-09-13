import { ArrowUUpLeftIcon, ArrowUUpRightIcon } from "@phosphor-icons/react";
import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";

/** Undo and redo are Plate's own; this only puts them in the toolbar. */
export const historyFeature: ContentFeature = {
	key: "history",
	plugins: () => [],
	toolbar: [
		{
			key: "undo",
			group: "history",
			icon: ArrowUUpLeftIcon,
			label: "undo",
			kbd: ["⌘", "Z"],
			secondary: true,
			isDisabled: (editor) => editor.history.undos.length === 0,
			run: (editor) => editor.undo(),
		},
		{
			key: "redo",
			group: "history",
			icon: ArrowUUpRightIcon,
			label: "redo",
			kbd: ["⌘", "⇧", "Z"],
			secondary: true,
			isDisabled: (editor) => editor.history.redos.length === 0,
			run: (editor) => editor.redo(),
		},
	],
	allowIn: () => true,
};
