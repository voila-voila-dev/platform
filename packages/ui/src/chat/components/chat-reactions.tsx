import type * as React from "react";
import { cva } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const chatReactionsVariants = cva({
	base: "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-background has-[button]:p-0",
	variants: {
		side: {
			top: "-translate-y-3/4 top-0",
			bottom: "translate-y-3/4 bottom-0",
		},
		align: {
			start: "left-3",
			end: "right-3",
		},
	},
	defaultVariants: {
		side: "bottom",
		align: "end",
	},
});

interface Props extends React.ComponentProps<"div"> {
	align?: "start" | "end";
	side?: "top" | "bottom";
}

/** Reaction pill overlapping the bubble's edge (emoji, counts, buttons). */
export function ChatReactions({
	side = "bottom",
	align = "end",
	className,
	...props
}: Props) {
	return (
		<div
			data-slot="chat-reactions"
			data-align={align}
			data-side={side}
			className={cn(chatReactionsVariants({ side, align }), className)}
			{...props}
		/>
	);
}
