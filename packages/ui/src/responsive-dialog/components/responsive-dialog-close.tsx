import * as React from "react";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveDialogIsMobile } from "#/responsive-dialog/context/responsive-dialog-context.ts";

interface Props
	extends Omit<React.ComponentProps<typeof Drawer.Close>, "asChild"> {
	/** Element form only — the drawer half clones it, so render functions are unsupported. */
	render?: React.ReactElement;
}

export function ResponsiveDialogClose({ render, children, ...props }: Props) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialog.Close");
	if (isMobile) {
		if (render) {
			return (
				<Drawer.Close asChild {...props}>
					{children === undefined
						? render
						: React.cloneElement(render, undefined, children)}
				</Drawer.Close>
			);
		}
		return <Drawer.Close {...props}>{children}</Drawer.Close>;
	}
	return (
		<Dialog.Close render={render} {...props}>
			{children}
		</Dialog.Close>
	);
}
