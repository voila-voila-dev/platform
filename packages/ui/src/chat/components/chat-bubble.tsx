import type * as React from "react";
import {
	type ChatBubbleVariants,
	chatBubbleVariants,
} from "#/chat/components/chat-bubble-variants.ts";
import { cn } from "#/lib/utils.ts";

type Props = React.ComponentProps<"div"> &
	ChatBubbleVariants & {
		align?: "start" | "end";
	};

/**
 * One message bubble. The variant colors the `Chat.BubbleContent` surface;
 * `align="end"` pushes the bubble to the row's end when used outside a
 * `Chat.Message` (inside one, the row's alignment already applies).
 */
export function ChatBubble({
	variant = "default",
	align = "start",
	className,
	...props
}: Props) {
	return (
		<div
			data-slot="chat-bubble"
			data-variant={variant}
			data-align={align}
			className={cn(chatBubbleVariants({ variant }), className)}
			{...props}
		/>
	);
}
