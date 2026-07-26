import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveDialogIsMobile } from "#/responsive-dialog/context/responsive-dialog-context.ts";

interface Props extends React.ComponentProps<"div"> {
	closeLabel?: string;
}

export function ResponsiveDialogFooter({
	className,
	closeLabel,
	children,
	...props
}: Props) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialog.Footer");
	if (isMobile) {
		return (
			<Drawer.Footer className={className} {...props}>
				{children}
				{/* Last in the column = bottom, matching the dialog footer's
				    col-reverse order where the close action sits below the primary. */}
				{closeLabel !== undefined && (
					<Drawer.Close asChild>
						<Button data-slot="drawer-footer-close" variant="outline">
							{closeLabel}
						</Button>
					</Drawer.Close>
				)}
			</Drawer.Footer>
		);
	}
	return (
		<Dialog.Footer className={className} closeLabel={closeLabel} {...props}>
			{children}
		</Dialog.Footer>
	);
}
