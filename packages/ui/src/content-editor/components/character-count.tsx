import { useEditorSelector } from "platejs/react";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import {
	type ContentValue,
	isContentText,
} from "#/content-editor/features/content-value.ts";

export function countContentCharacters(value: ContentValue): number {
	let count = 0;
	const visit = (nodes: ContentValue[number]["children"]) => {
		for (const node of nodes) {
			if (isContentText(node)) {
				count += node.text.length;
			} else {
				visit(node.children);
			}
		}
	};
	for (const node of value) {
		visit(node.children);
	}
	return count;
}

export function countContentWords(value: ContentValue): number {
	const texts: string[] = [];
	const visit = (nodes: ContentValue[number]["children"]) => {
		for (const node of nodes) {
			if (isContentText(node)) {
				texts.push(node.text);
			} else {
				visit(node.children);
			}
		}
	};
	for (const node of value) {
		visit(node.children);
		texts.push("\n");
	}
	return texts
		.join("")
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
}

interface Props {
	/** Which figure to show; both by default. */
	show?: "characters" | "words" | "both";
}

export function ContentEditorCharacterCount({ show = "both" }: Props) {
	const labels = useContentEditorLabels();
	const value = useEditorSelector(
		(editor) => editor.children as ContentValue,
		[],
	);
	return (
		<span data-slot="content-editor-character-count">
			{show !== "words"
				? labels.chrome.characters(countContentCharacters(value))
				: null}
			{show === "both" ? " · " : null}
			{show !== "characters"
				? labels.chrome.words(countContentWords(value))
				: null}
		</span>
	);
}
ContentEditorCharacterCount.slot = "status" as const;
