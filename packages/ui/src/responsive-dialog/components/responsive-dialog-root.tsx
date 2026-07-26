import * as React from "react";
import { Dialog } from "#/dialog/components/dialog.tsx";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import type { ResponsiveOverlayRootProps } from "#/lib/responsive-overlay.ts";
import { ResponsiveDialogContext } from "#/responsive-dialog/context/responsive-dialog-context.ts";

interface Props extends ResponsiveOverlayRootProps {}

// The root owns the open state so it survives crossing the breakpoint while
// open — the two halves are different component trees, so uncontrolled state
// would reset.
export function ResponsiveDialogRoot({
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
		<ResponsiveDialogContext.Provider value={isMobile}>
			{isMobile ? (
				<Drawer.Root open={isOpen} onOpenChange={handleOpenChange}>
					{children}
				</Drawer.Root>
			) : (
				<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
					{children}
				</Dialog.Root>
			)}
		</ResponsiveDialogContext.Provider>
	);
}
