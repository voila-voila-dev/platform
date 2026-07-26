import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { useResponsiveDialogIsMobile } from "#/responsive-dialog/context/responsive-dialog-context.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Free-form content between header and footer. The dialog half already pads
 * its popup; the drawer half doesn't, so this adds the missing gutter there.
 */
export function ResponsiveDialogBody({ className, ...props }: Props) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialog.Body");
	return (
		<div
			data-slot="responsive-dialog-body"
			className={cn(isMobile && "overflow-y-auto px-4", className)}
			{...props}
		/>
	);
}
