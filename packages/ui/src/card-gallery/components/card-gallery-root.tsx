import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {
	/**
	 * Narrowest a card may get before the grid drops a column, as a CSS
	 * length. The column count follows from the container width alone — no
	 * breakpoint props to configure.
	 */
	itemMinWidth?: string;
}

export function CardGalleryRoot({
	className,
	itemMinWidth = "8.5rem",
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(var(--card-gallery-item-min),1fr))]",
					className,
				),
				style: {
					"--card-gallery-item-min": itemMinWidth,
				} as React.CSSProperties,
			},
			props,
		),
		render,
		state: {
			slot: "card-gallery",
		},
	});
}
