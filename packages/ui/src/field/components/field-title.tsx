import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function FieldTitle({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "field-title" },
	});
}
