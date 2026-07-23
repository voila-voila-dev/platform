import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@voila.dev/ui/lib/utils";

import { type TextVariants, textVariants } from "#/components/text-variants.ts";

type TextProps = useRender.ComponentProps<"p"> & TextVariants;

/** Marketing copy block — renders a `p`; pass `render` for `span`/`div`. */
function Text({
	className,
	render,
	variant,
	size,
	align,
	weight,
	...props
}: TextProps) {
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
} from "#/components/text-variants.ts";
export { Text, type TextProps };
