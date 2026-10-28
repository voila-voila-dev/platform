import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** Hide the bar from the `md` breakpoint up (default `true`). */
	hideOnDesktop?: boolean;
}

export function StickyActionBar({
	className,
	hideOnDesktop = true,
	...props
}: Props) {
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
		/>
	);
}
