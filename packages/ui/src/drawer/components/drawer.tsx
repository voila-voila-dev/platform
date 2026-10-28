import { DrawerClose } from "#/drawer/components/drawer-close.tsx";
import { DrawerContent } from "#/drawer/components/drawer-content.tsx";
import { DrawerDescription } from "#/drawer/components/drawer-description.tsx";
import { DrawerFooter } from "#/drawer/components/drawer-footer.tsx";
import { DrawerHandle } from "#/drawer/components/drawer-handle.tsx";
import { DrawerHeader } from "#/drawer/components/drawer-header.tsx";
import { DrawerOverlay } from "#/drawer/components/drawer-overlay.tsx";
import { DrawerPortal } from "#/drawer/components/drawer-portal.tsx";
import { DrawerRoot } from "#/drawer/components/drawer-root.tsx";
import { DrawerTitle } from "#/drawer/components/drawer-title.tsx";
import { DrawerTrigger } from "#/drawer/components/drawer-trigger.tsx";

// Unlike the Base UI overlays in this kit, the drawer is Radix-based (vaul):
// compose with `asChild` (not `render`) and style against `data-state`.

/**
 * The Drawer parts as one namespace.
 */
export const Drawer = {
	Root: DrawerRoot,
	Close: DrawerClose,
	Content: DrawerContent,
	Description: DrawerDescription,
	Footer: DrawerFooter,
	Handle: DrawerHandle,
	Header: DrawerHeader,
	Overlay: DrawerOverlay,
	Portal: DrawerPortal,
	Title: DrawerTitle,
	Trigger: DrawerTrigger,
};
