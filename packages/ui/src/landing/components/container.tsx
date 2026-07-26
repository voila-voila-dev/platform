import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type ContainerVariants,
	containerVariants,
} from "#/landing/components/container-variants.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div">, ContainerVariants {}

/** Centered max-width column with responsive gutters. */
export function Container({ className, render, size, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(containerVariants({ size }), className),
			},
			props,
		),
		render,
		state: {
			slot: "landing-container",
		},
	});
}

export {
	type ContainerVariants,
	containerSizeOptions,
	containerVariants,
} from "#/landing/components/container-variants.ts";
