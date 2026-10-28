import * as React from "react";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveDialogIsMobile } from "#/responsive-dialog/context/responsive-dialog-context.ts";

interface Props
	extends Omit<React.ComponentProps<typeof Drawer.Trigger>, "asChild"> {
	/** Element form only — the drawer half clones it, so render functions are unsupported. */
	render?: React.ReactElement;
}

// The halves disagree on composition (Base UI `render` vs Radix `asChild`); the
// trigger bridges that by accepting the element form of `render` only.
export function ResponsiveDialogTrigger({ render, children, ...props }: Props) {
	const isMobile = useResponsiveDialogIsMobile("ResponsiveDialog.Trigger");
	if (isMobile) {
		if (render) {
			return (
				<Drawer.Trigger asChild {...props}>
					{children === undefined
						? render
						: React.cloneElement(render, undefined, children)}
				</Drawer.Trigger>
			);
		}
		return <Drawer.Trigger {...props}>{children}</Drawer.Trigger>;
	}
	return (
		<Dialog.Trigger render={render} {...props}>
			{children}
		</Dialog.Trigger>
	);
}
