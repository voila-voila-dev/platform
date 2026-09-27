import {
	ListBulletsIcon,
	ListNumbersIcon,
	SealIcon,
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
import type { PlateElementProps } from "platejs/react";
import type { ReactNode } from "react";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import {
	type ContentListStyle,
	type ContentParagraphNode,
	listItemNumber,
} from "#/content-editor/features/paragraph/reader.tsx";

const LIST_ITEMS = {
	disc: { key: "bulletedList", icon: ListBulletsIcon },
	decimal: { key: "numberedList", icon: ListNumbersIcon },
	badge: { key: "badgeList", icon: SealIcon },
} as const;

function listItem(style: ContentListStyle) {
	const { key, icon } = LIST_ITEMS[style];
	return {
		key,
		icon,
		label: key,
		isActive: (editor: ContentEditorApi) => someList(editor, style),
		run: (editor: ContentEditorApi) =>
			toggleList(editor, { listStyleType: style }),
	};
}

const bulleted = listItem("disc");
const numbered = listItem("decimal");
const badged = listItem("badge");

/**
 * Plate draws any style it does not know as an `<ol>` with that
 * `list-style-type`, which the browser ignores; a badge item draws its own
 * number, as the email does.
 */
function BadgeListItem({
	element,
	children,
}: {
	readonly element: PlateElementProps["element"];
	readonly children?: ReactNode;
}) {
	const theme = useContentEditorTheme();
	return (
		<ol data-list-style="badge" className="m-0 list-none p-0">
			<li className="flex items-start gap-3">
				<span
					contentEditable={false}
					aria-hidden
					className="mt-[0.1em] flex size-6 shrink-0 select-none items-center justify-center rounded-full font-semibold text-[12px] text-primary-foreground"
					style={{ backgroundColor: theme.color.brand }}
				>
					{listItemNumber(element as unknown as ContentParagraphNode)}
				</span>
				<div className="min-w-0 flex-1">{children}</div>
			</li>
		</ol>
	);
}

const PlateListPlugin = ListPlugin.extend(({ plugin }) => ({
	render: {
		belowNodes: (props) =>
			props.element.listStyleType === "badge"
				? (inner: { readonly children?: ReactNode }) => (
						<BadgeListItem element={props.element}>
							{inner.children}
						</BadgeListItem>
					)
				: plugin.render.belowNodes?.(props),
	},
}));

/**
 * Plate's indent-list model: a list item is a paragraph with `listStyleType`
 * and `indent`, so this feature declares no node of its own and instead
 * targets the block types the other features declared as indentable.
 */
export const listFeature: ContentFeature = {
	key: "list",
	plugins: ({ indentableTypes }) => [
		IndentPlugin.configure({ inject: { targetPlugins: [...indentableTypes] } }),
		PlateListPlugin.configure({
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
			secondary: true,
			run: (editor) => outdent(editor),
		},
		{
			key: "indent",
			group: "list",
			icon: TextIndentIcon,
			label: "indent",
			kbd: ["Tab"],
			secondary: true,
			run: (editor) => indent(editor),
		},
	],
	slash: [
		{ ...bulleted, keywords: ["list", "bullet", "unordered"] },
		{ ...numbered, keywords: ["list", "number", "ordered"] },
	],
	allowIn: (mode) => mode === "block",
};

/**
 * Offers the badge list, the email's numbered list, in the toolbar and the
 * slash menu. `listFeature` draws a badge item wherever one comes from; this
 * only lets the author make one, so a document editor leaves it out.
 */
export const badgeListFeature: ContentFeature = {
	key: "badgeList",
	plugins: () => [],
	toolbar: [{ ...badged, group: "list" }],
	slash: [{ ...badged, keywords: ["list", "badge", "steps", "numbered"] }],
	allowIn: (mode) => mode === "block",
};
