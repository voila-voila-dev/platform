import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@voila.dev/ui/lib/utils";

import {
	type HeadingVariants,
	headingVariants,
} from "#/components/heading-variants.ts";

type HeadingLevel = NonNullable<HeadingVariants["level"]>;

type HeadingProps = useRender.ComponentProps<"h2"> &
	HeadingVariants & {
		/** Sets both the rendered tag and the size scale (override the tag with `render`). */
		level?: HeadingLevel;
	};

/** Marketing heading — `font-heading`, responsive size scale per level. */
function Heading({
	className,
	render,
	level = "h2",
	align,
	...props
}: HeadingProps) {
	return useRender({
		defaultTagName: level,
		props: mergeProps<"h2">(
			{
				className: cn(headingVariants({ level, align }), className),
			},
			props,
		),
		render,
		state: {
			slot: "landing-heading",
		},
	});
}

export {
	type HeadingVariants,
	headingAlignOptions,
	headingLevelOptions,
	headingVariants,
} from "#/components/heading-variants.ts";
export { Heading, type HeadingLevel, type HeadingProps };
