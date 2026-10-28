import type * as React from "react";
import { cva } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const chatReactionsVariants = cva({
	base: [
		// In flow on purpose: the pill straddles the bubble's edge through a
		// negative margin, so the half sticking out still counts in layout and
		// pushes the next message down instead of covering it.
		"relative z-10 flex w-fit max-w-full shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-background has-[button]:p-0",
		// @starting-style grows the pill out of the bubble's edge — margin is in
		// the transition so the room it takes in the thread grows with it.
		"scale-100 transition-[margin,scale,opacity,translate] duration-200 starting:scale-75 starting:opacity-0 motion-reduce:transition-none",
	],
	variants: {
		side: {
			// -3 with the bubble's gap-1 nets an 8px overlap: the pill eats only
			// the bubble's padding, never its last line of text.
			top: "-mb-3 order-first origin-bottom starting:-mb-5",
			bottom: "-mt-3 order-last origin-top starting:-mt-5",
		},
		align: {
			start: "ml-3 self-start",
			end: "mr-3 self-end",
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

/**
 * Reaction pill straddling the bubble's edge (emoji, counts, buttons).
 * `align` follows the bubble's own side of the thread; `side` picks which edge
 * the pill overlaps. The `order-*` classes place it visually whichever side of
 * the content it sits in the markup.
 */
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
