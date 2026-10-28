import { MenubarCheckboxItem } from "#/menubar/components/menubar-checkbox-item.tsx";
import { MenubarContent } from "#/menubar/components/menubar-content.tsx";
import { MenubarGroup } from "#/menubar/components/menubar-group.tsx";
import { MenubarItem } from "#/menubar/components/menubar-item.tsx";
import { MenubarLabel } from "#/menubar/components/menubar-label.tsx";
import { MenubarMenu } from "#/menubar/components/menubar-menu.tsx";
import { MenubarPortal } from "#/menubar/components/menubar-portal.tsx";
import { MenubarRadioGroup } from "#/menubar/components/menubar-radio-group.tsx";
import { MenubarRadioItem } from "#/menubar/components/menubar-radio-item.tsx";
import { MenubarRoot } from "#/menubar/components/menubar-root.tsx";
import { MenubarSeparator } from "#/menubar/components/menubar-separator.tsx";
import { MenubarShortcut } from "#/menubar/components/menubar-shortcut.tsx";
import { MenubarSub } from "#/menubar/components/menubar-sub.tsx";
import { MenubarSubContent } from "#/menubar/components/menubar-sub-content.tsx";
import { MenubarSubTrigger } from "#/menubar/components/menubar-sub-trigger.tsx";
import { MenubarTrigger } from "#/menubar/components/menubar-trigger.tsx";

/**
 * The Menubar parts as one namespace.
 */
export const Menubar = {
	Root: MenubarRoot,
	CheckboxItem: MenubarCheckboxItem,
	Content: MenubarContent,
	Group: MenubarGroup,
	Item: MenubarItem,
	Label: MenubarLabel,
	Menu: MenubarMenu,
	Portal: MenubarPortal,
	RadioGroup: MenubarRadioGroup,
	RadioItem: MenubarRadioItem,
	Separator: MenubarSeparator,
	Shortcut: MenubarShortcut,
	Sub: MenubarSub,
	SubContent: MenubarSubContent,
	SubTrigger: MenubarSubTrigger,
	Trigger: MenubarTrigger,
};
