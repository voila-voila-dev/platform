import type * as React from "react";
import { cn } from "#/lib/utils.ts";

/**
 * Bottom-anchored in-page action bar for a mobile primary action — a sticky
 * footer, NOT a dialog. It sticks to the bottom of the viewport with a
 * top border and a background fill, and reserves extra bottom padding for the
 * iOS home indicator via `env(safe-area-inset-bottom)`.
 *
 * It's shown on mobile and hidden from `md` up by default; pass
 * `hideOnDesktop={false}` (or override via `className`) to keep it on every
 * breakpoint. Children are laid out in a flex row, so multiple buttons sit
 * side by side.
 */
function StickyActionBar({
	className,
	children,
	hideOnDesktop = true,
	...props
}: React.ComponentProps<"div"> & {
	/** Hide the bar from the `md` breakpoint up (default `true`). */
	hideOnDesktop?: boolean;
}) {
	return (
		<div
			data-slot="sticky-action-bar"
			className={cn(
				"sticky inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t bg-background px-4 pt-3",
				// Extra bottom padding clears the iOS home indicator.
				"pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
				"*:data-[slot=button]:flex-1",
				hideOnDesktop && "md:hidden",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export { StickyActionBar };
