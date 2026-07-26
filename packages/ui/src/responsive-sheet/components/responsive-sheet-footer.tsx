import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveSheetIsMobile } from "#/responsive-sheet/context/responsive-sheet-context.ts";
import { Sheet } from "#/sheet/components/sheet.tsx";

interface Props extends React.ComponentProps<"div"> {
	/** Renders an outline close button after `children`. */
	closeLabel?: string;
}

export function ResponsiveSheetFooter({
	className,
	closeLabel,
	children,
	...props
}: Props) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheet.Footer");
	const close = closeLabel !== undefined && (
		<Sheet.Close
			data-slot="responsive-sheet-footer-close"
			render={<Button variant="outline" />}
		>
			{closeLabel}
		</Sheet.Close>
	);
	if (isMobile) {
		return (
			<Drawer.Footer className={className} {...props}>
				{children}
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
		<Sheet.Footer className={className} {...props}>
			{children}
			{close}
		</Sheet.Footer>
	);
}
