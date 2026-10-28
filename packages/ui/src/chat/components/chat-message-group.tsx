import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {
	align: "start" | "end";
}

export function ChatMessageGroup({
	align,
	className,
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					// `group` so descendants (e.g. ChatMessageTime) can react to the
					// group's `data-align` via `group-data-[align=end]:*`.
					// Stretched on purpose: a shrink-to-fit group makes the bubbles'
					// percentage `max-width` cyclic and short bubbles collapse into a
					// per-word wrap (same rationale as on `ChatBubbleGroup`).
					"group flex w-full min-w-0 flex-col gap-1",
					align === "end" ? "items-end" : "items-start",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "chat-message-group", align },
	});
}
