import type * as React from "react";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveDialogIsMobile } from "#/responsive-dialog/context/responsive-dialog-context.ts";

interface Props extends React.ComponentProps<typeof Drawer.Title> {}

export function ResponsiveDialogTitle({ className, ...props }: Props) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialog.Title");
	return isMobile ? (
		<Drawer.Title className={className} {...props} />
	) : (
		<Dialog.Title className={className} {...props} />
	);
}
