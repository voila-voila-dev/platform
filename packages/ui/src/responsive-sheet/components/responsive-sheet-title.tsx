import type * as React from "react";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveSheetIsMobile } from "#/responsive-sheet/context/responsive-sheet-context.ts";
import { Sheet } from "#/sheet/components/sheet.tsx";

interface Props extends React.ComponentProps<typeof Drawer.Title> {}

export function ResponsiveSheetTitle({ className, ...props }: Props) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheet.Title");
	return isMobile ? (
		<Drawer.Title className={className} {...props} />
	) : (
		<Sheet.Title className={className} {...props} />
	);
}
