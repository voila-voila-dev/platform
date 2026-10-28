import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {
	size?: "default" | "sm" | "lg";
}

export function AvatarGroupCount({
	className,
	size = "default",
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background data-[size=lg]:size-10 data-[size=sm]:size-6 data-[size=lg]:text-base data-[size=sm]:text-xs [&>svg]:size-4 data-[size=lg]:[&>svg]:size-5 data-[size=sm]:[&>svg]:size-3",
					className,
				),
			},
			props,
		),
		render,
		state: { slot: "avatar-group-count", size },
	});
}
