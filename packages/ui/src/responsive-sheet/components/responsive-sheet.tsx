import { ResponsiveSheetBody } from "#/responsive-sheet/components/responsive-sheet-body.tsx";
import { ResponsiveSheetClose } from "#/responsive-sheet/components/responsive-sheet-close.tsx";
import { ResponsiveSheetContent } from "#/responsive-sheet/components/responsive-sheet-content.tsx";
import { ResponsiveSheetDescription } from "#/responsive-sheet/components/responsive-sheet-description.tsx";
import { ResponsiveSheetFooter } from "#/responsive-sheet/components/responsive-sheet-footer.tsx";
import { ResponsiveSheetHeader } from "#/responsive-sheet/components/responsive-sheet-header.tsx";
import { ResponsiveSheetRoot } from "#/responsive-sheet/components/responsive-sheet-root.tsx";
import { ResponsiveSheetTitle } from "#/responsive-sheet/components/responsive-sheet-title.tsx";
import { ResponsiveSheetTrigger } from "#/responsive-sheet/components/responsive-sheet-trigger.tsx";

/**
 * The ResponsiveSheet parts as one namespace.
 *
 * One API, two surfaces: a side sheet on desktop and a vaul bottom drawer under
 * the `useIsMobile` breakpoint (768px) — the same split `ResponsiveDialog` makes
 * for centered dialogs.
 */
export const ResponsiveSheet = {
	Root: ResponsiveSheetRoot,
	Body: ResponsiveSheetBody,
	Close: ResponsiveSheetClose,
	Content: ResponsiveSheetContent,
	Description: ResponsiveSheetDescription,
	Footer: ResponsiveSheetFooter,
	Header: ResponsiveSheetHeader,
	Title: ResponsiveSheetTitle,
	Trigger: ResponsiveSheetTrigger,
};
