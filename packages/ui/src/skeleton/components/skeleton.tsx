import type * as React from "react";

import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Purely visual placeholder with no semantics of its own: wrap the loading
 * region in `role="status"` with sr-only "Loading..." text (or mark the
 * skeletons `aria-hidden`) so screen readers announce the load.
 */
export function Skeleton({ className, ...props }: Props) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"animate-pulse rounded-md bg-muted motion-reduce:animate-none",
				className,
			)}
			{...props}
		/>
	);
}
