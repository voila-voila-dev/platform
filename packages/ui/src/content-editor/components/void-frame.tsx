import { useFocused, useSelected } from "platejs/react";
import type { ReactNode } from "react";
import { cn } from "#/lib/utils.ts";

interface Props {
	className?: string;
	/** Flows inside a line of text (a variable chip) instead of standing as a block. */
	inline?: boolean;
	children: ReactNode;
}

/**
 * The non-editable box every void element draws itself in. It rings itself
 * while the caret is on it, since a void shows no caret: without the ring,
 * an arrow key that lands on it looks like it did nothing, and Backspace
 * then deletes something the author never saw selected.
 */
export function VoidFrame({ className, inline = false, children }: Props) {
	const selected = useSelected();
	const focused = useFocused();
	const Tag = inline ? "span" : "figure";
	return (
		<Tag
			contentEditable={false}
			data-selected={(selected && focused) || undefined}
			className={cn(
				"select-none rounded-md data-selected:bg-accent/60 data-selected:outline-2 data-selected:outline-offset-2 data-selected:outline-ring",
				inline ? "inline-flex align-baseline" : "flex flex-col gap-1 py-1",
				className,
			)}
		>
			{children}
		</Tag>
	);
}

interface EmptyProps {
	className?: string;
	children: ReactNode;
}

/** The dashed placeholder a void element shows before it has a source. */
export function VoidEmpty({ className, children }: EmptyProps) {
	return (
		<div
			className={cn(
				"flex min-h-24 w-full items-center justify-center gap-2 rounded-xl border border-border border-dashed bg-muted/40 px-4 py-6 text-muted-foreground text-sm",
				className,
			)}
		>
			{children}
		</div>
	);
}
