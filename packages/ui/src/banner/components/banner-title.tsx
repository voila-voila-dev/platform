import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function BannerTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"flex-1 font-medium text-balance [&_a]:underline [&_a]:underline-offset-4",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "banner-title" },
	});
}
