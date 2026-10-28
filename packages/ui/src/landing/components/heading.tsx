import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type HeadingVariants,
	headingVariants,
} from "#/landing/components/heading-variants.ts";
import { cn } from "#/lib/utils.ts";

export type HeadingLevel = NonNullable<HeadingVariants["level"]>;

interface Props extends useRender.ComponentProps<"h2">, HeadingVariants {
	/** Sets both the rendered tag and the size scale (override the tag with `render`). */
	level?: HeadingLevel;
}

/** Marketing heading — `font-heading`, responsive size scale per level. */
export function Heading({
	className,
	render,
	level = "h2",
	align,
	...props
}: Props) {
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
} from "#/landing/components/heading-variants.ts";
