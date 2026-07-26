import { SidebarContent } from "#/sidebar/components/sidebar-content.tsx";
import { SidebarFooter } from "#/sidebar/components/sidebar-footer.tsx";
import { SidebarGroup } from "#/sidebar/components/sidebar-group.tsx";
import { SidebarGroupAction } from "#/sidebar/components/sidebar-group-action.tsx";
import { SidebarGroupContent } from "#/sidebar/components/sidebar-group-content.tsx";
import { SidebarGroupLabel } from "#/sidebar/components/sidebar-group-label.tsx";
import { SidebarHeader } from "#/sidebar/components/sidebar-header.tsx";
import { SidebarInput } from "#/sidebar/components/sidebar-input.tsx";
import { SidebarInset } from "#/sidebar/components/sidebar-inset.tsx";
import { SidebarMenu } from "#/sidebar/components/sidebar-menu.tsx";
import { SidebarMenuAction } from "#/sidebar/components/sidebar-menu-action.tsx";
import { SidebarMenuBadge } from "#/sidebar/components/sidebar-menu-badge.tsx";
import { SidebarMenuButton } from "#/sidebar/components/sidebar-menu-button.tsx";
import { SidebarMenuItem } from "#/sidebar/components/sidebar-menu-item.tsx";
import { SidebarMenuSkeleton } from "#/sidebar/components/sidebar-menu-skeleton.tsx";
import { SidebarMenuSub } from "#/sidebar/components/sidebar-menu-sub.tsx";
import { SidebarMenuSubButton } from "#/sidebar/components/sidebar-menu-sub-button.tsx";
import { SidebarMenuSubItem } from "#/sidebar/components/sidebar-menu-sub-item.tsx";
import { SidebarProvider } from "#/sidebar/components/sidebar-provider.tsx";
import { SidebarRail } from "#/sidebar/components/sidebar-rail.tsx";
import { SidebarRoot } from "#/sidebar/components/sidebar-root.tsx";
import { SidebarSeparator } from "#/sidebar/components/sidebar-separator.tsx";
import { SidebarTrigger } from "#/sidebar/components/sidebar-trigger.tsx";

export { useSidebar } from "#/sidebar/context/sidebar-context.ts";

/**
 * The Sidebar parts as one namespace.
 */
export const Sidebar = {
	Root: SidebarRoot,
	Content: SidebarContent,
	Footer: SidebarFooter,
	Group: SidebarGroup,
	GroupAction: SidebarGroupAction,
	GroupContent: SidebarGroupContent,
	GroupLabel: SidebarGroupLabel,
	Header: SidebarHeader,
	Input: SidebarInput,
	Inset: SidebarInset,
	Menu: SidebarMenu,
	MenuAction: SidebarMenuAction,
	MenuBadge: SidebarMenuBadge,
	MenuButton: SidebarMenuButton,
	MenuItem: SidebarMenuItem,
	MenuSkeleton: SidebarMenuSkeleton,
	MenuSub: SidebarMenuSub,
	MenuSubButton: SidebarMenuSubButton,
	MenuSubItem: SidebarMenuSubItem,
	Provider: SidebarProvider,
	Rail: SidebarRail,
	Separator: SidebarSeparator,
	Trigger: SidebarTrigger,
};
