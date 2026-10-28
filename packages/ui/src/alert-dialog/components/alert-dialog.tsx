import { AlertDialogAction } from "#/alert-dialog/components/alert-dialog-action.tsx";
import { AlertDialogCancel } from "#/alert-dialog/components/alert-dialog-cancel.tsx";
import { AlertDialogClose } from "#/alert-dialog/components/alert-dialog-close.tsx";
import { AlertDialogContent } from "#/alert-dialog/components/alert-dialog-content.tsx";
import { AlertDialogDescription } from "#/alert-dialog/components/alert-dialog-description.tsx";
import { AlertDialogFooter } from "#/alert-dialog/components/alert-dialog-footer.tsx";
import { AlertDialogHeader } from "#/alert-dialog/components/alert-dialog-header.tsx";
import { AlertDialogMedia } from "#/alert-dialog/components/alert-dialog-media.tsx";
import { AlertDialogOverlay } from "#/alert-dialog/components/alert-dialog-overlay.tsx";
import { AlertDialogPortal } from "#/alert-dialog/components/alert-dialog-portal.tsx";
import { AlertDialogRoot } from "#/alert-dialog/components/alert-dialog-root.tsx";
import { AlertDialogTitle } from "#/alert-dialog/components/alert-dialog-title.tsx";
import { AlertDialogTrigger } from "#/alert-dialog/components/alert-dialog-trigger.tsx";

/**
 * The AlertDialog parts as one namespace.
 */
export const AlertDialog = {
	Root: AlertDialogRoot,
	Action: AlertDialogAction,
	Cancel: AlertDialogCancel,
	Close: AlertDialogClose,
	Content: AlertDialogContent,
	Description: AlertDialogDescription,
	Footer: AlertDialogFooter,
	Header: AlertDialogHeader,
	Media: AlertDialogMedia,
	Overlay: AlertDialogOverlay,
	Portal: AlertDialogPortal,
	Title: AlertDialogTitle,
	Trigger: AlertDialogTrigger,
};
