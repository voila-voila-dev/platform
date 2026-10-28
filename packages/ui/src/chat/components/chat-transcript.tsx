import type * as React from "react";
import { MessageScrollerContent } from "#/chat/components/message-scroller-content.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof MessageScrollerContent> {}

/**
 * The transcript container (a polite live region). Direct children should be
 * `Chat.Item` rows so the scroller can anchor, preserve and observe them.
 */
export function ChatTranscript({ className, ...props }: Props) {
	return (
		<MessageScrollerContent
			data-slot="chat-transcript"
			aria-live="polite"
			className={cn("flex h-max min-h-full flex-col gap-4 pr-1", className)}
			{...props}
		/>
	);
}
