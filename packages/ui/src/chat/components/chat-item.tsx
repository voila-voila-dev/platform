import type * as React from "react";
import { MessageScrollerItem } from "#/chat/components/message-scroller-item.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof MessageScrollerItem> {}

/**
 * One transcript row: a message, marker, separator, typing row or load-more
 * row. Give it a stable `messageId` for scrollToMessage/visibility/prepend
 * preservation; set `scrollAnchor` on turn boundaries (e.g. the reader's own
 * messages) so a new turn lands at the reading line.
 */
export function ChatItem({ className, ...props }: Props) {
	return (
		<MessageScrollerItem
			data-slot="chat-item"
			// No `content-visibility: auto` here: it implies paint containment at
			// all times, not just while the row is off screen, so anything a row
			// draws outside its own box gets clipped — the reaction pill
			// overlapping the bubble's edge, its ring, any hover affordance.
			className={cn("min-w-0 shrink-0", className)}
			{...props}
		/>
	);
}
