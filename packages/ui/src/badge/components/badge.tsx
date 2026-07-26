import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type BadgeVariants,
	badgeVariants,
} from "#/badge/components/badge-variants.ts";
import { cn } from "#/lib/utils.ts";

type Props = useRender.ComponentProps<"span"> & BadgeVariants;

export function Badge({
	className,
	variant = "default",
	color,
	size = "default",
	render,
	...props
}: Props) {
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
