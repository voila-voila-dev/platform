import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function StatCardValue({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"px-4 text-2xl font-semibold tracking-tight tabular-nums group-data-[size=sm]/card:px-3",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "stat-card-value" },
	});
}
