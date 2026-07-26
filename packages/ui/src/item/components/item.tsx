import { ItemActions } from "#/item/components/item-actions.tsx";
import { ItemContent } from "#/item/components/item-content.tsx";
import { ItemDescription } from "#/item/components/item-description.tsx";
import { ItemFooter } from "#/item/components/item-footer.tsx";
import { ItemGroup } from "#/item/components/item-group.tsx";
import { ItemHeader } from "#/item/components/item-header.tsx";
import { ItemMedia } from "#/item/components/item-media.tsx";
import { ItemRoot } from "#/item/components/item-root.tsx";
import { ItemSeparator } from "#/item/components/item-separator.tsx";
import { ItemTitle } from "#/item/components/item-title.tsx";

/**
 * The Item parts as one namespace.
 */
export const Item = {
	Root: ItemRoot,
	Actions: ItemActions,
	Content: ItemContent,
	Description: ItemDescription,
	Footer: ItemFooter,
	Group: ItemGroup,
	Header: ItemHeader,
	Media: ItemMedia,
	Separator: ItemSeparator,
	Title: ItemTitle,
};
