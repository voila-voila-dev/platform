import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {}

/** Decorative icon slot for a marker (hidden from assistive tech). */
export function ChatMarkerIcon({ className, ...props }: Props) {
	return (
		<span
			data-slot="chat-marker-icon"
			aria-hidden="true"
			className={cn(
				"size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
}
