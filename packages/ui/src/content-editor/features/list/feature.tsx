import {
	ListBulletsIcon,
	ListNumbersIcon,
	TextIndentIcon,
	TextOutdentIcon,
} from "@phosphor-icons/react";
import { indent, outdent } from "@platejs/indent";
import { IndentPlugin } from "@platejs/indent/react";
import {
	BulletedListRules,
	OrderedListRules,
	someList,
	toggleList,
} from "@platejs/list";
import { ListPlugin } from "@platejs/list/react";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import type { ContentListStyle } from "#/content-editor/features/paragraph/reader.tsx";

function listItem(style: ContentListStyle) {
	return {
		key: style === "disc" ? "bulletedList" : "numberedList",
		icon: style === "disc" ? ListBulletsIcon : ListNumbersIcon,
		label: style === "disc" ? "bulletedList" : "numberedList",
		isActive: (editor: ContentEditorApi) => someList(editor, style),
		run: (editor: ContentEditorApi) =>
			toggleList(editor, { listStyleType: style }),
	};
}

const bulleted = listItem("disc");
const numbered = listItem("decimal");

/**
 * Plate's indent-list model: a list item is a paragraph with `listStyleType`
 * and `indent`, so this feature declares no node of its own and instead
 * targets the block types the other features declared as indentable.
 */
export const listFeature: ContentFeature = {
	key: "list",
	plugins: ({ indentableTypes }) => [
		IndentPlugin.configure({ inject: { targetPlugins: [...indentableTypes] } }),
		ListPlugin.configure({
			inputRules: [
				BulletedListRules.markdown({ variant: "-" }),
				BulletedListRules.markdown({ variant: "*" }),
				OrderedListRules.markdown({ variant: "." }),
				OrderedListRules.markdown({ variant: ")" }),
			],
		}),
	],
	toolbar: [
		{ ...bulleted, group: "list" },
		{ ...numbered, group: "list" },
		{
			key: "outdent",
			group: "list",
			icon: TextOutdentIcon,
			label: "outdent",
			kbd: ["⇧", "Tab"],
			run: (editor) => outdent(editor),
		},
		{
			key: "indent",
			group: "list",
			icon: TextIndentIcon,
			label: "indent",
			kbd: ["Tab"],
			run: (editor) => indent(editor),
		},
	],
	slash: [
		{ ...bulleted, keywords: ["list", "bullet", "unordered"] },
		{ ...numbered, keywords: ["list", "number", "ordered"] },
	],
	allowIn: (mode) => mode === "block",
};
