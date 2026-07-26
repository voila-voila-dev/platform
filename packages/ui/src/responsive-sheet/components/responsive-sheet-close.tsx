import * as React from "react";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveSheetIsMobile } from "#/responsive-sheet/context/responsive-sheet-context.ts";
import { Sheet } from "#/sheet/components/sheet.tsx";

interface Props
	extends Omit<React.ComponentProps<typeof Drawer.Close>, "asChild"> {
	/** Element form only — the drawer half clones it, so render functions are unsupported. */
	render?: React.ReactElement;
}

export function ResponsiveSheetClose({ render, children, ...props }: Props) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheet.Close");
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
		<Sheet.Close render={render} {...props}>
			{children}
		</Sheet.Close>
	);
}
