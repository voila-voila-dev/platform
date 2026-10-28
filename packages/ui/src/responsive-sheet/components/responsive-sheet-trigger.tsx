import * as React from "react";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveSheetIsMobile } from "#/responsive-sheet/context/responsive-sheet-context.ts";
import { Sheet } from "#/sheet/components/sheet.tsx";

interface Props
	extends Omit<React.ComponentProps<typeof Drawer.Trigger>, "asChild"> {
	/** Element form only — the drawer half clones it, so render functions are unsupported. */
	render?: React.ReactElement;
}

// The halves disagree on composition (Base UI `render` vs Radix `asChild`); the
// trigger bridges that by accepting the element form of `render` only.
export function ResponsiveSheetTrigger({ render, children, ...props }: Props) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheet.Trigger");
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
		<Sheet.Trigger render={render} {...props}>
			{children}
		</Sheet.Trigger>
	);
}
