import type * as React from "react";
import { MessageScroller } from "#/chat/components/message-scroller.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** The scroller frame: positions the viewport and the floating scroll button. */
export function ChatRoot({ className, ...props }: Props) {
	return (
		<MessageScroller
			data-slot="chat-root"
			className={cn(
				"group/chat relative flex size-full min-h-0 flex-col overflow-hidden",
				className,
			)}
			{...props}
		/>
	);
}
