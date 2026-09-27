import { LinkIcon } from "@phosphor-icons/react";
import { LinkRules } from "@platejs/link";
import { LinkPlugin } from "@platejs/link/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import {
	ContentLinkPopover,
	linkAtSelection,
} from "#/content-editor/components/link-popover.tsx";
import type {
	ContentFeature,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";
import { linkReader } from "#/content-editor/features/link/reader.tsx";

/**
 * Rendered as `<a>` so a link stays in the inline flow; Plate's default
 * element is a `<div>`, which would break a pasted link onto its own line.
 * `href` and `target` come through `attributes` from `getLinkAttributes`.
 */
export function LinkElement(props: PlateElementProps) {
	return (
		<PlateElement
			{...props}
			as="a"
			className="text-primary underline underline-offset-2"
		/>
	);
}

const linkItem: ContentToolbarItem = {
	key: "link",
	group: "text",
	icon: LinkIcon,
	label: "link",
	kbd: ["⌘", "K"],
	hotkey: "mod+k",
	isActive: (editor) => linkAtSelection(editor) !== null,
	isDisabled: (editor) =>
		editor.selection === null ||
		(editor.api.isCollapsed() && linkAtSelection(editor) === null),
	run: () => {},
	Popover: ContentLinkPopover,
};

export const linkFeature: ContentFeature = {
	...linkReader,
	// A pasted URL becomes a link; pasted over selected text, it links that
	// text, as in Gmail and Notion.
	plugins: () => [
		LinkPlugin.configure({
			inputRules: [LinkRules.autolink({ variant: "paste" })],
		}),
	],
	components: { a: LinkElement },
	toolbar: [linkItem],
	floating: [linkItem],
	fields: {
		a: [{ type: "url", key: "url", label: "url", placeholder: "https://" }],
	},
	allowIn: () => true,
};
