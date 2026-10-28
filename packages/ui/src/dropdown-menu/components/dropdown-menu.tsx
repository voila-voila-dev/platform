import { DropdownMenuCheckboxItem } from "#/dropdown-menu/components/dropdown-menu-checkbox-item.tsx";
import { DropdownMenuContent } from "#/dropdown-menu/components/dropdown-menu-content.tsx";
import { DropdownMenuGroup } from "#/dropdown-menu/components/dropdown-menu-group.tsx";
import { DropdownMenuItem } from "#/dropdown-menu/components/dropdown-menu-item.tsx";
import { DropdownMenuLabel } from "#/dropdown-menu/components/dropdown-menu-label.tsx";
import { DropdownMenuPortal } from "#/dropdown-menu/components/dropdown-menu-portal.tsx";
import { DropdownMenuRadioGroup } from "#/dropdown-menu/components/dropdown-menu-radio-group.tsx";
import { DropdownMenuRadioItem } from "#/dropdown-menu/components/dropdown-menu-radio-item.tsx";
import { DropdownMenuRoot } from "#/dropdown-menu/components/dropdown-menu-root.tsx";
import { DropdownMenuSeparator } from "#/dropdown-menu/components/dropdown-menu-separator.tsx";
import { DropdownMenuShortcut } from "#/dropdown-menu/components/dropdown-menu-shortcut.tsx";
import { DropdownMenuSub } from "#/dropdown-menu/components/dropdown-menu-sub.tsx";
import { DropdownMenuSubContent } from "#/dropdown-menu/components/dropdown-menu-sub-content.tsx";
import { DropdownMenuSubTrigger } from "#/dropdown-menu/components/dropdown-menu-sub-trigger.tsx";
import { DropdownMenuTrigger } from "#/dropdown-menu/components/dropdown-menu-trigger.tsx";

/**
 * The DropdownMenu parts as one namespace.
 */
export const DropdownMenu = {
	Root: DropdownMenuRoot,
	CheckboxItem: DropdownMenuCheckboxItem,
	Content: DropdownMenuContent,
	Group: DropdownMenuGroup,
	Item: DropdownMenuItem,
	Label: DropdownMenuLabel,
	Portal: DropdownMenuPortal,
	RadioGroup: DropdownMenuRadioGroup,
	RadioItem: DropdownMenuRadioItem,
	Separator: DropdownMenuSeparator,
	Shortcut: DropdownMenuShortcut,
	Sub: DropdownMenuSub,
	SubContent: DropdownMenuSubContent,
	SubTrigger: DropdownMenuSubTrigger,
	Trigger: DropdownMenuTrigger,
};
