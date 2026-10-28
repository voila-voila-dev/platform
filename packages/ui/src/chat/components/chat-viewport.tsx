import type * as React from "react";
import { MessageScrollerViewport } from "#/chat/components/message-scroller-viewport.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof MessageScrollerViewport> {}

/**
 * The scrollable element. `scroll-fade-b` hints at more content below with a
 * scroll-aware mask; the scrollbar is themed and hidden during programmatic
 * auto-scrolls (`data-autoscrolling`) so smooth follows don't flash it.
 */
export function ChatViewport({ className, ...props }: Props) {
	return (
		<MessageScrollerViewport
			data-slot="chat-viewport"
			className={cn(
				"size-full min-h-0 min-w-0 scroll-fade-b overflow-y-auto overscroll-contain [scrollbar-gutter:stable] [scrollbar-width:thin] data-autoscrolling:[scrollbar-color:transparent_transparent] dark:scheme-dark",
				className,
			)}
			{...props}
		/>
	);
}
