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
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}
