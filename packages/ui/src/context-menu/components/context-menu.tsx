import { ContextMenuCheckboxItem } from "#/context-menu/components/context-menu-checkbox-item.tsx";
import { ContextMenuContent } from "#/context-menu/components/context-menu-content.tsx";
import { ContextMenuGroup } from "#/context-menu/components/context-menu-group.tsx";
import { ContextMenuItem } from "#/context-menu/components/context-menu-item.tsx";
import { ContextMenuLabel } from "#/context-menu/components/context-menu-label.tsx";
import { ContextMenuPortal } from "#/context-menu/components/context-menu-portal.tsx";
import { ContextMenuRadioGroup } from "#/context-menu/components/context-menu-radio-group.tsx";
import { ContextMenuRadioItem } from "#/context-menu/components/context-menu-radio-item.tsx";
import { ContextMenuRoot } from "#/context-menu/components/context-menu-root.tsx";
import { ContextMenuSeparator } from "#/context-menu/components/context-menu-separator.tsx";
import { ContextMenuShortcut } from "#/context-menu/components/context-menu-shortcut.tsx";
import { ContextMenuSub } from "#/context-menu/components/context-menu-sub.tsx";
import { ContextMenuSubContent } from "#/context-menu/components/context-menu-sub-content.tsx";
import { ContextMenuSubTrigger } from "#/context-menu/components/context-menu-sub-trigger.tsx";
import { ContextMenuTrigger } from "#/context-menu/components/context-menu-trigger.tsx";

/**
 * The ContextMenu parts as one namespace.
 */
export const ContextMenu = {
	Root: ContextMenuRoot,
	CheckboxItem: ContextMenuCheckboxItem,
	Content: ContextMenuContent,
	Group: ContextMenuGroup,
	Item: ContextMenuItem,
	Label: ContextMenuLabel,
	Portal: ContextMenuPortal,
	RadioGroup: ContextMenuRadioGroup,
	RadioItem: ContextMenuRadioItem,
	Separator: ContextMenuSeparator,
	Shortcut: ContextMenuShortcut,
	Sub: ContextMenuSub,
	SubContent: ContextMenuSubContent,
	SubTrigger: ContextMenuSubTrigger,
	Trigger: ContextMenuTrigger,
};
