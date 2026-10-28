import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function StatCardHeader({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"flex items-center justify-between gap-2 px-4 group-data-[size=sm]/card:px-3",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "stat-card-header" },
	});
}
