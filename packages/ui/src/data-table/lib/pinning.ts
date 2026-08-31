import type { Column } from "@tanstack/react-table";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

/**
 * The solid twin of the row states' translucent washes, for pinned cells: a
 * pinned cell inherits the row's background, and a see-through one would let
 * the content sliding beneath ghost through. Mixed over `--background` so it
 * lands on exactly the colour the translucent wash shows over the page.
 */
export const PINNED_ROW_STATE_CLASSES =
	"in-[tbody]:hover:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))] has-aria-expanded:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]";

/** Same solid wash for a sortable pinned header cell's own hover. */
export const PINNED_HEAD_HOVER_CLASS =
	"hover:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]";

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
		// The shadow is what says "this floats above the content sliding under
		// it" — but only while something actually does: keyed on the container's
		// scroll-edge attributes, it fades in as the table scrolls and leaves an
		// unscrolled table clean. Zero spread on purpose: a negative one shrinks
		// each cell's shadow vertically and the edge reads as scalloped dashes,
		// while at zero the neighbours overlap into one continuous band. Mixed
		// from `--foreground` rather than black, so it darkens on a light theme
		// and glows on a dark one.
		side === "left" &&
			column.getIsLastColumn("left") &&
			"in-data-scrolled-start:shadow-[3px_0_4px_0_color-mix(in_oklab,var(--foreground)_12%,transparent)] in-data-scrolled-start:border-r transition-shadow",
		side === "right" &&
			column.getIsFirstColumn("right") &&
			"in-data-scrolled-end:shadow-[-3px_0_4px_0_color-mix(in_oklab,var(--foreground)_12%,transparent)] in-data-scrolled-end:border-l transition-shadow",
	);
}
