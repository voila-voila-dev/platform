import {
	CodeIcon,
	TextBIcon,
	TextItalicIcon,
	TextStrikethroughIcon,
	TextUnderlineIcon,
} from "@phosphor-icons/react";
import {
	BoldRules,
	CodeRules,
	ItalicRules,
	StrikethroughRules,
	UnderlineRules,
} from "@platejs/basic-nodes";
import {
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import type { AnyPlatePlugin } from "platejs/react";
import type {
	ContentFeature,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";
import {
	CONTENT_MARKS,
	type ContentMark,
	createTextMarksReader,
} from "#/content-editor/features/text-marks/reader.tsx";

function markItem(
	key: string,
	icon: ContentToolbarItem["icon"],
	kbd: ReadonlyArray<string> | undefined,
): ContentToolbarItem {
	return {
		key,
		group: "text",
		icon,
		label: key,
		kbd,
		isActive: (editor) => editor.api.marks()?.[key] === true,
		run: (editor) => editor.tf.toggleMark(key),
	};
}

const marks = {
	bold: {
		item: markItem("bold", TextBIcon, ["⌘", "B"]),
		plugin: () => BoldPlugin.configure({ inputRules: [BoldRules.markdown()] }),
	},
	italic: {
		item: markItem("italic", TextItalicIcon, ["⌘", "I"]),
		plugin: () =>
			ItalicPlugin.configure({ inputRules: [ItalicRules.markdown()] }),
	},
	underline: {
		item: markItem("underline", TextUnderlineIcon, ["⌘", "U"]),
		plugin: () =>
			UnderlinePlugin.configure({ inputRules: [UnderlineRules.markdown()] }),
	},
	strikethrough: {
		item: markItem("strikethrough", TextStrikethroughIcon, undefined),
		plugin: () =>
			StrikethroughPlugin.configure({
				inputRules: [StrikethroughRules.markdown()],
			}),
	},
	code: {
		item: markItem("code", CodeIcon, ["⌘", "E"]),
		plugin: () => CodePlugin.configure({ inputRules: [CodeRules.markdown()] }),
	},
} satisfies Record<
	ContentMark,
	{ readonly item: ContentToolbarItem; readonly plugin: () => AnyPlatePlugin }
>;

/**
 * The marks the author can apply, and nothing else: a mark left out has no
 * plugin, so neither its key nor its Markdown shortcut nor a paste applies it.
 */
export function createTextMarksFeature(
	only: ReadonlyArray<ContentMark> = CONTENT_MARKS,
): ContentFeature {
	const kept = CONTENT_MARKS.filter((mark) => only.includes(mark));
	const items = kept.map((mark) => marks[mark].item);
	return {
		...createTextMarksReader(kept),
		plugins: () => kept.map((mark) => marks[mark].plugin()),
		toolbar: items,
		floating: items,
	};
}

export const textMarksFeature = createTextMarksFeature();
