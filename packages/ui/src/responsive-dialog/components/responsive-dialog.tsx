import { ResponsiveDialogBody } from "#/responsive-dialog/components/responsive-dialog-body.tsx";
import { ResponsiveDialogClose } from "#/responsive-dialog/components/responsive-dialog-close.tsx";
import { ResponsiveDialogContent } from "#/responsive-dialog/components/responsive-dialog-content.tsx";
import { ResponsiveDialogDescription } from "#/responsive-dialog/components/responsive-dialog-description.tsx";
import { ResponsiveDialogFooter } from "#/responsive-dialog/components/responsive-dialog-footer.tsx";
import { ResponsiveDialogHeader } from "#/responsive-dialog/components/responsive-dialog-header.tsx";
import { ResponsiveDialogRoot } from "#/responsive-dialog/components/responsive-dialog-root.tsx";
import { ResponsiveDialogTitle } from "#/responsive-dialog/components/responsive-dialog-title.tsx";
import { ResponsiveDialogTrigger } from "#/responsive-dialog/components/responsive-dialog-trigger.tsx";

/**
 * The ResponsiveDialog parts as one namespace.
 *
 * One API, two surfaces: a centered Base UI dialog on desktop and a vaul
 * bottom drawer under the `useIsMobile` breakpoint (768px).
 */
export const ResponsiveDialog = {
	Root: ResponsiveDialogRoot,
	Body: ResponsiveDialogBody,
	Close: ResponsiveDialogClose,
	Content: ResponsiveDialogContent,
	Description: ResponsiveDialogDescription,
	Footer: ResponsiveDialogFooter,
	Header: ResponsiveDialogHeader,
	Title: ResponsiveDialogTitle,
	Trigger: ResponsiveDialogTrigger,
};
