import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

/**
 * The bubble surface. Polymorphic via `render` (pass a `<button/>` or `<a/>`
 * to make the whole bubble interactive). Subtle enter animation for appended
 * messages; respects reduced motion.
 */
export function ChatBubbleContent({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					// `min-w-0` + `overflow-wrap:anywhere` keep an unbroken word/URL
					// inside the bubble instead of overflowing the list horizontally.
					"flex w-fit min-w-0 max-w-full flex-col items-start gap-0.5 overflow-hidden whitespace-pre-wrap rounded-xl border border-transparent px-3 py-2 text-left text-sm leading-relaxed [overflow-wrap:anywhere]",
					"fade-in slide-in-from-bottom-1 animate-in motion-reduce:animate-none",
					"group-data-[align=end]/bubble:self-end [button,a]:outline-none [button,a]:transition-colors [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/50",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "chat-bubble-content",
		},
	});
}
