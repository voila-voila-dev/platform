import type * as React from "react";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveDialogIsMobile } from "#/responsive-dialog/context/responsive-dialog-context.ts";

interface Props extends React.ComponentProps<typeof Drawer.Description> {}

export function ResponsiveDialogDescription({ className, ...props }: Props) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialog.Description");
	return isMobile ? (
		<Drawer.Description className={className} {...props} />
	) : (
		<Dialog.Description className={className} {...props} />
	);
}
