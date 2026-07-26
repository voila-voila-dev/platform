import * as React from "react";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import type { ResponsiveOverlayRootProps } from "#/lib/responsive-overlay.ts";
import { ResponsiveSheetContext } from "#/responsive-sheet/context/responsive-sheet-context.ts";
import { Sheet } from "#/sheet/components/sheet.tsx";

interface Props extends ResponsiveOverlayRootProps {}

// The root owns the open state so it survives crossing the breakpoint while
// open: the two halves are different component trees, so uncontrolled state
// would reset.
export function ResponsiveSheetRoot({
	open,
	defaultOpen = false,
	onOpenChange,
	children,
}: Props) {
	const isMobile = useIsMobile();
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const isOpen = open ?? uncontrolledOpen;
	const handleOpenChange = (nextOpen: boolean) => {
		setUncontrolledOpen(nextOpen);
		onOpenChange?.(nextOpen);
	};

	return (
		<ResponsiveSheetContext.Provider value={isMobile}>
			{isMobile ? (
				<Drawer.Root open={isOpen} onOpenChange={handleOpenChange}>
					{children}
				</Drawer.Root>
			) : (
				<Sheet.Root open={isOpen} onOpenChange={handleOpenChange}>
					{children}
				</Sheet.Root>
			)}
		</ResponsiveSheetContext.Provider>
	);
}
