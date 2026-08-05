import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {}

/** Marker text; centered between the rules in the separator variant. */
export function ChatMarkerContent({ className, ...props }: Props) {
	return (
		<span
			data-slot="chat-marker-content"
			className={cn(
				"min-w-0 [overflow-wrap:anywhere] group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center",
				className,
			)}
			{...props}
		/>
	);
}
