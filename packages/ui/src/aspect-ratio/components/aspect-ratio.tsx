import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {
	/**
	 * The width-to-height ratio to hold, as a number (`16 / 9`) or as any string
	 * CSS `aspect-ratio` accepts (`"3/4"`).
	 *
	 * @default 1
	 */
	ratio?: number | string;
}

export function AspectRatio({ ratio = 1, className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn("relative aspect-(--ratio)", className),
				style: {
					"--ratio": ratio,
				} as React.CSSProperties,
			},
			props,
		),
		render,
		state: {
			slot: "aspect-ratio",
		},
	});
}
