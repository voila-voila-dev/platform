import { NavigationMenuContent } from "#/navigation-menu/components/navigation-menu-content.tsx";
import { NavigationMenuIndicator } from "#/navigation-menu/components/navigation-menu-indicator.tsx";
import { NavigationMenuItem } from "#/navigation-menu/components/navigation-menu-item.tsx";
import { NavigationMenuLink } from "#/navigation-menu/components/navigation-menu-link.tsx";
import { NavigationMenuList } from "#/navigation-menu/components/navigation-menu-list.tsx";
import { NavigationMenuPositioner } from "#/navigation-menu/components/navigation-menu-positioner.tsx";
import { NavigationMenuRoot } from "#/navigation-menu/components/navigation-menu-root.tsx";
import { NavigationMenuTrigger } from "#/navigation-menu/components/navigation-menu-trigger.tsx";

/**
 * The NavigationMenu parts as one namespace.
 */
export const NavigationMenu = {
	Root: NavigationMenuRoot,
	Content: NavigationMenuContent,
	Indicator: NavigationMenuIndicator,
	Item: NavigationMenuItem,
	Link: NavigationMenuLink,
	List: NavigationMenuList,
	Positioner: NavigationMenuPositioner,
	Trigger: NavigationMenuTrigger,
};

export { navigationMenuTriggerStyle } from "#/navigation-menu/components/navigation-menu-variants.ts";
