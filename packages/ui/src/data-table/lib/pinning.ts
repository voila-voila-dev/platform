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
		// The edge is drawn by a pseudo-element rather than the cell's own
		// border and shadow: the table collapses its borders, which hands them
		// to the table's own paint pass — underneath every cell background,
		// where a pinned column buries them — and drops cell box-shadows
		// altogether, so neither ever reaches the screen. A rule floating above
		// the cell does.
		//
		// The whole pseudo-element hangs off the container's scroll-edge
		// attribute rather than fading in from a resting state: `in-*` matches
		// through `:where()`, which carries no specificity, so an unscrolled
		// base would outrank it and the edge would never show. Unscrolled, the
		// rule has no `content` and so does not exist — which is the point, an
		// unscrolled table has nothing to float above. Zero spread on the glow:
		// a negative one shrinks each cell's shadow vertically and the edge
		// reads as scalloped dashes, while at zero the neighbours overlap into
		// one continuous band. Mixed from `--foreground` rather than black, so
		// it darkens on a light theme and glows on a dark one.
		side === "left" &&
			column.getIsLastColumn("left") &&
			"in-data-scrolled-start:after:pointer-events-none in-data-scrolled-start:after:absolute in-data-scrolled-start:after:inset-y-0 in-data-scrolled-start:after:right-0 in-data-scrolled-start:after:w-px in-data-scrolled-start:after:bg-border in-data-scrolled-start:after:content-[''] in-data-scrolled-start:after:shadow-[3px_0_4px_0_color-mix(in_oklab,var(--foreground)_12%,transparent)]",
		side === "right" &&
			column.getIsFirstColumn("right") &&
			"in-data-scrolled-end:after:pointer-events-none in-data-scrolled-end:after:absolute in-data-scrolled-end:after:inset-y-0 in-data-scrolled-end:after:left-0 in-data-scrolled-end:after:w-px in-data-scrolled-end:after:bg-border in-data-scrolled-end:after:content-[''] in-data-scrolled-end:after:shadow-[-3px_0_4px_0_color-mix(in_oklab,var(--foreground)_12%,transparent)]",
	);
}
