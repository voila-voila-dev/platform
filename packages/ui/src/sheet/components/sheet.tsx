import { SheetClose } from "#/sheet/components/sheet-close.tsx";
import { SheetContent } from "#/sheet/components/sheet-content.tsx";
import { SheetDescription } from "#/sheet/components/sheet-description.tsx";
import { SheetFooter } from "#/sheet/components/sheet-footer.tsx";
import { SheetHeader } from "#/sheet/components/sheet-header.tsx";
import { SheetOverlay } from "#/sheet/components/sheet-overlay.tsx";
import { SheetPortal } from "#/sheet/components/sheet-portal.tsx";
import { SheetRoot } from "#/sheet/components/sheet-root.tsx";
import { SheetTitle } from "#/sheet/components/sheet-title.tsx";
import { SheetTrigger } from "#/sheet/components/sheet-trigger.tsx";

export type { SheetContentSize } from "#/sheet/components/sheet-content.tsx";

/**
 * The Sheet parts as one namespace.
 */
export const Sheet = {
	Root: SheetRoot,
	Close: SheetClose,
	Content: SheetContent,
	Description: SheetDescription,
	Footer: SheetFooter,
	Header: SheetHeader,
	Overlay: SheetOverlay,
	Portal: SheetPortal,
	Title: SheetTitle,
	Trigger: SheetTrigger,
};
