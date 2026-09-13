import { LinkIcon } from "@phosphor-icons/react";
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
	isActive: (editor) => linkAtSelection(editor) !== null,
	isDisabled: (editor) =>
		editor.selection === null ||
		(editor.api.isCollapsed() && linkAtSelection(editor) === null),
	run: () => {},
	Popover: ContentLinkPopover,
};

export const linkFeature: ContentFeature = {
	...linkReader,
	plugins: () => [LinkPlugin],
	components: { a: LinkElement },
	toolbar: [linkItem],
	floating: [linkItem],
	allowIn: () => true,
};
