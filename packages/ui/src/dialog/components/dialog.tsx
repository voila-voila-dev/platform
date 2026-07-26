import { DialogClose } from "#/dialog/components/dialog-close.tsx";
import { DialogContent } from "#/dialog/components/dialog-content.tsx";
import { DialogDescription } from "#/dialog/components/dialog-description.tsx";
import { DialogFooter } from "#/dialog/components/dialog-footer.tsx";
import { DialogHeader } from "#/dialog/components/dialog-header.tsx";
import { DialogOverlay } from "#/dialog/components/dialog-overlay.tsx";
import { DialogPortal } from "#/dialog/components/dialog-portal.tsx";
import { DialogRoot } from "#/dialog/components/dialog-root.tsx";
import { DialogTitle } from "#/dialog/components/dialog-title.tsx";
import { DialogTrigger } from "#/dialog/components/dialog-trigger.tsx";

// `xl` is a documented extra beyond the kit's `sm | default | lg` scale for
// media-heavy dialogs (gallery lightbox, annuaire match review).
export type DialogContentSize = "sm" | "default" | "lg" | "xl";
/**
 * The Dialog parts as one namespace.
 */
export const Dialog = {
	Root: DialogRoot,
	Close: DialogClose,
	Content: DialogContent,
	Description: DialogDescription,
	Footer: DialogFooter,
	Header: DialogHeader,
	Overlay: DialogOverlay,
	Portal: DialogPortal,
	Title: DialogTitle,
	Trigger: DialogTrigger,
};
