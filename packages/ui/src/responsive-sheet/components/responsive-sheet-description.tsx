import type * as React from "react";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useResponsiveSheetIsMobile } from "#/responsive-sheet/context/responsive-sheet-context.ts";
import { Sheet } from "#/sheet/components/sheet.tsx";

interface Props extends React.ComponentProps<typeof Drawer.Description> {}

export function ResponsiveSheetDescription({ className, ...props }: Props) {
	const isMobile = useResponsiveSheetIsMobile("ResponsiveSheet.Description");
	return isMobile ? (
		<Drawer.Description className={className} {...props} />
	) : (
		<Sheet.Description className={className} {...props} />
	);
}
