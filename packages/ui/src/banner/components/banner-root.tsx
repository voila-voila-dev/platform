import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { bannerVariants } from "#/banner/components/banner-variants.ts";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

interface Props
	extends useRender.ComponentProps<"div">,
		VariantProps<typeof bannerVariants> {}

export function BannerRoot({ className, variant, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				role: "status",
				className: cn(bannerVariants({ variant }), className),
			},
			props,
		),
		render,
		state: { slot: "banner", variant },
	});
}
