import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {
	/**
	 * Draws a dashed frame around the block, for an empty state standing on its
	 * own. Leave it off inside something that already has a border — a card, or a
	 * table body.
	 */
	bordered?: boolean;
}

export function EmptyRoot({
	className,
	bordered = false,
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl p-6 text-center text-balance",
					bordered && "border border-dashed",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "empty", bordered },
	});
}
