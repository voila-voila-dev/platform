import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Avatar slot, anchored to the bottom of the row beside the last bubble. */
export function ChatAvatar({ className, ...props }: Props) {
	return (
		<div
			data-slot="chat-avatar"
			className={cn(
				"flex w-fit shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted",
				// With a footer under the bubbles, lift the avatar so it stays level
				// with the last bubble instead of the footer line.
				"group-has-data-[slot=chat-footer]/message:-translate-y-6",
				className,
			)}
			{...props}
		/>
	);
}
