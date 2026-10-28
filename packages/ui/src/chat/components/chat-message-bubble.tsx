import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type ChatMessageBubbleVariants,
	chatMessageBubbleVariants,
} from "#/chat/components/chat-message-bubble-variants.ts";
import { cn } from "#/lib/utils.ts";

interface Props
	extends useRender.ComponentProps<"div">,
		Required<Pick<ChatMessageBubbleVariants, "variant">> {}

/**
 * The own/other message bubble of the `Chat.Message*` family (list, group,
 * sender, text, time). Kept under its own name because `Chat.Message` is now
 * the sender row of the scroller anatomy; new screens compose
 * `Chat.Bubble` + `Chat.BubbleContent` instead.
 */
export function ChatMessageBubble({
	variant,
	className,
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{ className: cn(chatMessageBubbleVariants({ variant, className })) },
			props,
		),
		render,
		state: { slot: "chat-message-bubble", variant },
	});
}
