import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type ChatMessageVariants,
	chatMessageVariants,
} from "#/chat/components/chat-message-variants.ts";
import { cn } from "#/lib/utils.ts";

interface Props
	extends useRender.ComponentProps<"div">,
		Required<Pick<ChatMessageVariants, "variant">> {}

export function ChatMessage({ variant, className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{ className: cn(chatMessageVariants({ variant, className })) },
			props,
		),
		render,
		state: { slot: "chat-message", variant },
	});
}
