import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type TextVariants,
	textVariants,
} from "#/landing/components/text-variants.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"p">, TextVariants {}

/** Marketing copy block — renders a `p`; pass `render` for `span`/`div`. */
export function Text({
	className,
	render,
	variant,
	size,
	align,
	weight,
	...props
}: Props) {
	return useRender({
		defaultTagName: "p",
		props: mergeProps<"p">(
			{
				className: cn(
					textVariants({ variant, size, align, weight }),
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "landing-text",
		},
	});
}

export {
	type TextVariants,
	textAlignOptions,
	textSizeOptions,
	textVariantOptions,
	textVariants,
	textWeightOptions,
} from "#/landing/components/text-variants.ts";
