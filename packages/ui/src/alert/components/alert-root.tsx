import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { alertVariants } from "#/alert/components/alert-variants.ts";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

interface Props
	extends useRender.ComponentProps<"div">,
		VariantProps<typeof alertVariants> {}

export function AlertRoot({ className, variant, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				role: "alert",
				className: cn(alertVariants({ variant }), className),
			},
			props,
		),
		render,
		state: { slot: "alert" },
	});
}
