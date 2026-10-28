import type * as React from "react";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveDialogIsMobile } from "#/responsive-dialog/context/responsive-dialog-context.ts";

interface Props extends React.ComponentProps<"div"> {}

export function ResponsiveDialogHeader(props: Props) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialog.Header");
	return isMobile ? <Drawer.Header {...props} /> : <Dialog.Header {...props} />;
}
