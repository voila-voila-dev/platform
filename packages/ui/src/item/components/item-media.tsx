import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const itemMediaVariants = cva({
	base: "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
	variants: {
		variant: {
			default: "bg-transparent",
			icon: "[&_svg:not([class*='size-'])]:size-4",
			image:
				"size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

interface Props
	extends useRender.ComponentProps<"div">,
		VariantProps<typeof itemMediaVariants> {}

export function ItemMedia({
	className,
	variant = "default",
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(itemMediaVariants({ variant }), className),
			},
			props,
		),
		render,
		state: {
			slot: "item-media",
			variant,
		},
	});
}
