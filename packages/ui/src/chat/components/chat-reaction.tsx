import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends Omit<React.ComponentProps<"button">, "children"> {
	/** The emoji itself. */
	emoji: string;
	/** How many people reacted with it. Hidden at 1, like every chat app. */
	count?: number;
	/** Whether the reader is one of them — lights the chip and flips the toggle. */
	active?: boolean;
}

/**
 * One reaction on a message: the emoji, how many people chose it, and whether
 * the reader is one of them. A button because tapping it toggles the reader's
 * own reaction — `aria-pressed` is what says so to a screen reader.
 */
export function ChatReaction({
	emoji,
	count = 1,
	active = false,
	className,
	...props
}: Props) {
	return (
		<button
			type="button"
			data-slot="chat-reaction"
			data-active={active || undefined}
			aria-pressed={active}
			className={cn(
				"flex items-center gap-1 rounded-full px-1.5 py-0.5 text-sm leading-none transition-colors",
				"hover:bg-foreground/5",
				active && "bg-primary/10 text-primary",
				className,
			)}
			{...props}
		>
			<span aria-hidden>{emoji}</span>
			{count > 1 && (
				// Keyed on the count so a change remounts the number with a pop.
				<span
					key={count}
					className="fade-in-0 zoom-in-50 animate-in font-medium text-xs tabular-nums duration-150 motion-reduce:animate-none"
				>
					{count}
				</span>
			)}
		</button>
	);
}
