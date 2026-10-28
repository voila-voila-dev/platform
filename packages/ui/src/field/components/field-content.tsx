import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {}

export function FieldContent({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "field-content" },
	});
}
