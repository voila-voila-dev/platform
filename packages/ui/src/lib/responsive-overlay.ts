import type * as React from "react";

/**
 * The open-state contract shared by `ResponsiveDialog.Root` and
 * `ResponsiveSheet.Root`.
 *
 * Deliberately closed rather than extending the underlying primitive: the root
 * renders one of two different component trees depending on the viewport, so
 * there is no single element for unknown props to land on.
 */
export interface ResponsiveOverlayRootProps {
	/** Controlled open state. The root owns it so it survives crossing the breakpoint. */
	open?: boolean;
	/** Whether it starts open, when uncontrolled. */
	defaultOpen?: boolean;
	/** Called when the overlay opens or closes, on either surface. */
	onOpenChange?: (open: boolean) => void;
	/** The trigger and the content. */
	children?: React.ReactNode;
}
