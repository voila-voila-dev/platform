import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type ContainerVariants,
	containerVariants,
} from "#/landing/components/container-variants.ts";
import { cn } from "#/lib/utils.ts";

type ContainerProps = useRender.ComponentProps<"div"> & ContainerVariants;

/** Centered max-width column with responsive gutters. */
function Container({ className, render, size, ...props }: ContainerProps) {
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
export { Container, type ContainerProps };
