import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"p"> {}

export function CardGalleryDescription({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "p",
		props: mergeProps<"p">(
			{
				className: cn(
					"w-full truncate text-muted-foreground text-xs",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "card-gallery-description",
		},
	});
}
