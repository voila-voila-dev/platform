import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type BadgeVariants,
	badgeVariants,
} from "#/components/ui/badge-variants.ts";
import { cn } from "#/lib/utils.ts";

function Badge({
	className,
	variant = "default",
	color,
	size = "default",
	render,
	...props
}: useRender.ComponentProps<"span"> & BadgeVariants) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(badgeVariants({ variant, color, size }), className),
			},
			props,
		),
		render,
		state: {
			slot: "badge",
			variant,
			color,
			size,
		},
	});
}

export {
	type BadgeColor,
	type BadgeVariant,
	type BadgeVariants,
	badgeColorBackgroundClass,
	badgeColorForegroundClass,
	badgeColors,
	badgeVariantOptions,
	badgeVariants,
} from "#/components/ui/badge-variants.ts";
export { Badge };
