import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@voila.dev/ui/lib/utils";

import {
	type ContainerVariants,
	containerVariants,
} from "#/components/container-variants.ts";

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
} from "#/components/container-variants.ts";
export { Container, type ContainerProps };
