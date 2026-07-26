import type { Column } from "@tanstack/react-table";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

/**
 * Styles for a column frozen against an edge. The offset is the running width
 * of the columns pinned before it, so several can stack.
 */
export function pinnedStyle<TData>(
	column: Column<TData, unknown>,
): React.CSSProperties | undefined {
	const side = column.getIsPinned();
	if (side === false) {
		return undefined;
	}
	return side === "left"
		? { position: "sticky", left: column.getStart("left"), zIndex: 2 }
		: { position: "sticky", right: column.getAfter("right"), zIndex: 2 };
}

export function pinnedClass<TData>(
	column: Column<TData, unknown>,
): string | false {
	const side = column.getIsPinned();
	if (side === false) {
		return false;
	}
	return cn(
		// `bg-inherit` rather than a fixed colour: the row owns the background,
		// so a pinned cell follows hover, selection and expansion instead of
		// sitting there as an opaque patch that ignores them.
		"bg-inherit",
		// A border alone reads as just another column rule; the shadow is what
		// says "this floats above the content sliding under it". Mixed from
		// `--foreground` rather than black, so it darkens on a light theme and
		// glows on a dark one instead of vanishing into it.
		side === "left" &&
			column.getIsLastColumn("left") &&
			"border-r shadow-[6px_0_8px_-6px_color-mix(in_oklab,var(--foreground)_28%,transparent)]",
		side === "right" &&
			column.getIsFirstColumn("right") &&
			"border-l shadow-[-6px_0_8px_-6px_color-mix(in_oklab,var(--foreground)_28%,transparent)]",
	);
}
