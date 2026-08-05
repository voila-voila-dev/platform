import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Stacks consecutive bubbles from the same sender. */
export function ChatBubbleGroup({ className, ...props }: Props) {
	return (
		<div
			data-slot="chat-bubble-group"
			// Full width with the bubbles aligned INSIDE: keeping the group
			// stretched gives the bubbles' percentage `max-width` a definite
			// containing block. A shrink-to-fit (`self-end`) group would make that
			// percentage cyclic, which Chromium settles below the text's natural
			// width — end-aligned bubbles collapse to a sliver and wrap per
			// character.
			className={cn(
				"flex w-full min-w-0 flex-col gap-1",
				"group-data-[align=end]/message:items-end",
				className,
			)}
			{...props}
		/>
	);
}
