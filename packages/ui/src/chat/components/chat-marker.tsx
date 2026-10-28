import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type ChatMarkerVariants,
	chatMarkerVariants,
} from "#/chat/components/chat-marker-variants.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div">, ChatMarkerVariants {}

/**
 * Inline annotation between transcript rows: a status line, a divider label
 * (`variant="separator"`), or a bordered note (`variant="border"`).
 * Polymorphic via `render` for link/button markers. Pairs with the `shimmer`
 * utility for streaming/typing states.
 */
export function ChatMarker({
	className,
	variant = "default",
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(chatMarkerVariants({ variant, className })),
			},
			props,
		),
		render,
		state: {
			slot: "chat-marker",
			variant,
		},
	});
}
