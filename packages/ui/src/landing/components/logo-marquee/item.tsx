import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"img"> {}

/** One logo — renders an `img` by default; pass `render` for custom markup. */
export function LogoMarqueeItem({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "img",
		props: mergeProps<"img">(
			{
				className: cn(
					"h-12 w-auto shrink-0 object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0",
					className,
				),
				loading: "lazy",
			},
			props,
		),
		render,
		state: {
			slot: "logo-marquee-item",
		},
	});
}
