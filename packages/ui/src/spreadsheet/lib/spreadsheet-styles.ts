import { cva } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

// Grid-mode visuals: the focused cell's ring (plain `:focus` - a
// click-selected cell must show it too) and the selection range (tint on
// every selected cell, one outer border drawn by the per-edge ::after
// segments stamped by the grid hook).
const gridNavigationTableClassName = cn(
	"[&_td:focus]:outline-none [&_td:focus]:inset-ring-2 [&_td:focus]:inset-ring-ring/70",
	"[&_td[data-grid-selected]]:bg-primary/10",
	"[&_td[data-grid-selected]]:after:pointer-events-none [&_td[data-grid-selected]]:after:absolute [&_td[data-grid-selected]]:after:inset-0 [&_td[data-grid-selected]]:after:content-[''] [&_td[data-grid-selected]]:after:border-primary/60",
	"[&_td[data-grid-edge-top]]:after:border-t-2 [&_td[data-grid-edge-bottom]]:after:border-b-2 [&_td[data-grid-edge-left]]:after:border-l-2 [&_td[data-grid-edge-right]]:after:border-r-2",
);

// Sticky first column: every row's first CELL PART pins to the left edge
// while the other columns pan beneath it. Targeting `td[data-slot]` (the cell
// parts all stamp one) skips the full-width rows - add-row, virtual spacers -
// where pinning would only paint a stray edge line. Collapsed borders don't
// travel with sticky cells (the sticky-header trap again), so the right rule
// is redrawn as an inset shadow; the backgrounds must be opaque - color-mix
// flattens the kit's translucent tints (header muted, invalid destructive,
// selection primary) over the page background - or the panned columns would
// show through. Once the container actually pans (`data-scrolled-x`, stamped
// by a scroll listener), an elevation shadow marks the cut edge.
const stickyFirstColumnTableClassName = cn(
	"[&_thead_th:first-child]:sticky [&_thead_th:first-child]:left-0 [&_thead_th:first-child]:z-2",
	"[&_thead_th:first-child]:border-r-0 [&_thead_th:first-child]:bg-[color-mix(in_oklab,var(--color-muted)_50%,var(--color-background))]",
	"[&_thead_th:first-child]:shadow-[inset_-1px_0_var(--color-border)]",
	"[&_tbody_td[data-slot]:first-child]:sticky [&_tbody_td[data-slot]:first-child]:left-0 [&_tbody_td[data-slot]:first-child]:z-2",
	"[&_tbody_td[data-slot]:first-child]:border-r-0 [&_tbody_td[data-slot]:first-child]:bg-background",
	"[&_tbody_td[data-slot]:first-child]:shadow-[inset_-1px_0_var(--color-border)]",
	"[&_tbody_tr[data-invalid]_td[data-slot]:first-child]:bg-[color-mix(in_oklab,var(--color-destructive)_5%,var(--color-background))]",
	"[&_tbody_td[data-slot][data-grid-selected]:first-child]:bg-[color-mix(in_oklab,var(--color-primary)_10%,var(--color-background))]",
	"[[data-scrolled-x]_&_thead_th:first-child]:shadow-[inset_-1px_0_var(--color-border),6px_0_8px_-6px_rgb(0_0_0/0.25)]",
	"[[data-scrolled-x]_&_tbody_td[data-slot]:first-child]:shadow-[inset_-1px_0_var(--color-border),6px_0_8px_-6px_rgb(0_0_0/0.25)]",
);

export function editableTableClassName({
	hasFixedSizing,
	gridNavigation,
	stickyFirstColumn,
	stickyHeader,
	className,
}: {
	hasFixedSizing: boolean;
	gridNavigation: boolean;
	stickyFirstColumn: boolean;
	stickyHeader: boolean;
	className: string | undefined;
}) {
	return cn(
		"w-full caption-bottom text-sm",
		hasFixedSizing && "table-fixed",
		gridNavigation && gridNavigationTableClassName,
		stickyFirstColumn && stickyFirstColumnTableClassName,
		// A sticky header goes opaque (see SpreadsheetHeader); its pinned
		// corner cell must follow.
		stickyFirstColumn &&
			stickyHeader &&
			"[&_thead_th:first-child]:bg-background",
		className,
	);
}

/**
 * The `control` variant melts the kit's form controls into the cell: borders,
 * radii, backgrounds and focus/invalid rings are stripped off the control and
 * replaced by an `inset-ring` on the `<td>` (a plain `ring` would be clipped
 * by adjacent cells under border-collapse; the separate family also never
 * collides with the controls' own `ring-*` classes). Traps encoded below:
 *
 * - `MoneyInput` overwrites its `InputGroup`'s slot with
 *   `data-slot="money-input"`, so group flattening targets `fieldset[data-slot]`,
 *   never `[data-slot=input-group]`.
 * - The group's inner input is `data-slot="input-group-control"` and already
 *   flattened by `InputGroup.Input`; only the fieldset needs neutralizing.
 * - `InputGroup` raises its rings with `has-[...]` selectors, so the `ring-0`
 *   overrides must repeat the same `:has(...)` to win on specificity.
 * - `border-0` zeroes the border width, so color-only rules like
 *   `aria-invalid:border-destructive` become inert - no specificity battle.
 * - Never force `text-sm` on inputs: `text-base md:text-sm` in `input.tsx` is
 *   an iOS anti-zoom guard.
 * - `mx-auto` + the cell's `align-middle` center Checkbox/Switch without
 *   turning the td into a flex box; Switch is inline-flex, so it also gets
 *   `flex` (auto margins only center block-level boxes).
 */
const editableTableCellVariants = cva({
	base: "relative border-r border-b border-input align-middle last:border-r-0 group-data-[invalid=true]/editable-row:bg-destructive/5",
	variants: {
		variant: {
			text: "px-2.5 py-1.5 whitespace-nowrap text-muted-foreground",
			control: cn(
				"p-0 focus-within:z-1",
				// Cell-level focus/invalid rings, replacing the controls' own. The
				// focus ring is scoped to valid cells and the focused+invalid state
				// stacks two :has(), so the destructive ring wins on specificity
				// instead of depending on rule order in the generated stylesheet.
				"not-has-[[aria-invalid=true]]:has-[:focus-visible]:inset-ring-2 not-has-[[aria-invalid=true]]:has-[:focus-visible]:inset-ring-ring/70",
				"has-[[aria-invalid=true]]:bg-destructive/5 has-[[aria-invalid=true]]:inset-ring-2 has-[[aria-invalid=true]]:inset-ring-destructive/30",
				"has-[[aria-invalid=true]]:has-[:focus-visible]:inset-ring-destructive/60",
				// Flatten Input / Textarea.
				"[&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:shadow-none",
				"[&_[data-slot=input]:focus-visible]:ring-0 [&_[data-slot=input][aria-invalid=true]]:ring-0",
				"[&_[data-slot=input]:disabled]:bg-transparent dark:[&_[data-slot=input]]:bg-transparent",
				// Flatten NativeSelect (the border lives on the inner <select>).
				"[&_[data-slot=native-select]]:rounded-none [&_[data-slot=native-select]]:border-0",
				"[&_[data-slot=native-select]:focus-visible]:ring-0 [&_[data-slot=native-select][aria-invalid=true]]:ring-0",
				"dark:[&_[data-slot=native-select]]:bg-transparent",
				// Flatten InputGroup AND MoneyInput - see the data-slot trap above.
				"[&_fieldset[data-slot]]:rounded-none [&_fieldset[data-slot]]:border-0 [&_fieldset[data-slot]]:ring-0",
				"[&_fieldset[data-slot]:has([data-slot=input-group-control]:focus-visible)]:ring-0",
				"[&_fieldset[data-slot]:has([data-slot][aria-invalid=true])]:ring-0",
				"dark:[&_fieldset[data-slot]]:bg-transparent",
				// Flatten TranslationInput's trailing locale select (the group
				// itself is already covered by the fieldset[data-slot] rules).
				"[&_[data-slot=translation-input-locale]:focus-visible]:ring-0",
				// NestedTableInput fills its cell and defers ring/tint to it.
				"[&_[data-slot=nested-table-input]]:rounded-none [&_[data-slot=nested-table-input]]:border-0",
				"[&_[data-slot=nested-table-input]:focus-visible]:ring-0",
				// Center non-filling controls; cut their rings.
				"[&_[data-slot=checkbox]]:mx-auto [&_[data-slot=switch]]:mx-auto [&_[data-slot=switch]]:flex",
				"[&_[data-slot=checkbox]:focus-visible]:ring-0 [&_[data-slot=switch]:focus-visible]:ring-0",
			),
		},
	},
	defaultVariants: { variant: "control" },
});

// Computed once: the control variant is a large string and runs through
// twMerge, no reason to redo that per cell per render.
export const controlCellClassName = editableTableCellVariants({
	variant: "control",
});
export const textCellClassName = editableTableCellVariants({ variant: "text" });
