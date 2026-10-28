import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function EmptyContent({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "empty-content" },
	});
}
