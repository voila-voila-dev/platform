import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"p"> {}

export function EmptyDescription({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "p",
		props: mergeProps<"p">(
			{
				className: cn(
					"text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "empty-description" },
	});
}
