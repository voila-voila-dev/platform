import * as React from "react";
import { SpreadsheetDesktopTable } from "#/spreadsheet/components/spreadsheet-desktop-table.tsx";
import type { SpreadsheetSort } from "#/spreadsheet/context/spreadsheet-context.ts";
import { useSpreadsheetContextValue } from "#/spreadsheet/hooks/use-spreadsheet-context-value.ts";
import type { SpreadsheetDropLine } from "#/spreadsheet/hooks/use-spreadsheet-drag.ts";
import {
	type SpreadsheetPasteData,
	useSpreadsheetGrid,
} from "#/spreadsheet/hooks/use-spreadsheet-grid.ts";
import { useSpreadsheetScrolledX } from "#/spreadsheet/hooks/use-spreadsheet-scrolled-x.ts";
import { editableTableClassName } from "#/spreadsheet/lib/spreadsheet-styles.ts";

interface Props extends React.ComponentProps<"table"> {
	/**
	 * Classes for the scroll container around the table, which is where a bounded
	 * height belongs — `className` goes to the `<table>` itself and cannot scroll.
	 */
	containerClassName?: string;
	/**
	 * Pins the header row while the body scrolls. Only useful together with a
	 * `max-h-*` on the container (via `containerClassName`).
	 */
	stickyHeader?: boolean;
	/**
	 * Pins each row's first cell while the table pans horizontally, keeping the
	 * row label readable on narrow screens; an edge shadow appears once the
	 * container is actually scrolled. Render a read-only part
	 * (`SpreadsheetCellText`) as the first column - a panning grid under a
	 * pinned editable cell is disorienting.
	 */
	stickyFirstColumn?: boolean;
	/**
	 * Controlled sort state for `sortable` header cells. The table never sorts
	 * the rows itself: reorder your row array when this changes (a sorted view
	 * over indexed form rows would break their binding).
	 */
	sort?: SpreadsheetSort | null;
	/** Called with the next sort, or `null` at the end of the tri-state cycle. */
	onSortChange?: (sort: SpreadsheetSort | null) => void;
	/**
	 * Column widths by `columnId`, written by `resizable` header cells. Leave
	 * undefined for internal state; pass it (with `onColumnSizingChange`) to
	 * control or persist the widths. Any entry switches the table to
	 * `table-layout: fixed`.
	 */
	columnSizing?: Record<string, number>;
	/** Called on every drag frame of a resize; debounce before persisting. */
	onColumnSizingChange?: (sizing: Record<string, number>) => void;
	/**
	 * Controlled column order, as the list of `columnId`s currently rendered.
	 * Providing it (with `onColumnOrderChange`) makes identified header cells
	 * draggable and Alt+arrow movable; the consumer re-renders columns, header
	 * and body cells alike, in the received order.
	 */
	columnOrder?: string[];
	/** Called with the new `columnId` order once a drag or Alt+arrow move lands. */
	onColumnOrderChange?: (order: string[]) => void;
	/**
	 * Enables `SpreadsheetDragHandle` cells: called with the dragged row's
	 * index and its target position. Apply the move to your row array.
	 */
	onRowMove?: (fromIndex: number, toIndex: number) => void;
	/**
	 * Opt-in spreadsheet keyboard layer, upgrading the table to `role="grid"`:
	 * the body cells become a single roving tab stop (arrows/Home/End/PageUp/
	 * PageDown move, Enter/F2/typing edits, Escape comes back), Shift+arrows or
	 * pointer drag select a rectangle and Cmd/Ctrl+C copies it as TSV (the
	 * `value` prop on `SpreadsheetCell` overrides what's copied). Off by
	 * default: the phase-1 native Tab order stays the baseline.
	 */
	gridNavigation?: boolean;
	/**
	 * Grid-mode paste (Cmd/Ctrl+V on a cell in navigation mode): receives the
	 * parsed TSV matrix and the target's top-left position. The table never
	 * mutates anything - apply the values to your row array, extending it when
	 * the paste overflows (multi-row pastes from Excel/Sheets are the target
	 * use case).
	 */
	onPasteData?: (data: SpreadsheetPasteData) => void;
}

/** Hooks, context and class assembly behind the desktop rendering. */
export function SpreadsheetDesktop({
	className,
	containerClassName,
	stickyHeader = false,
	stickyFirstColumn = false,
	sort = null,
	onSortChange,
	columnSizing,
	onColumnSizingChange,
	columnOrder,
	onColumnOrderChange,
	onRowMove,
	gridNavigation = false,
	onPasteData,
	...props
}: Props) {
	const [internalSizing, setInternalSizing] = React.useState<
		Record<string, number>
	>({});
	const [dropLine, setDropLine] = React.useState<SpreadsheetDropLine | null>(
		null,
	);
	const [announcement, setAnnouncement] = React.useState("");
	const [virtualRowCount, setVirtualRowCount] = React.useState<number | null>(
		null,
	);
	const [scrollContainer, setScrollContainer] =
		React.useState<HTMLDivElement | null>(null);
	const sizing = columnSizing ?? internalSizing;
	const grid = useSpreadsheetGrid({
		enabled: gridNavigation,
		onPasteData,
		virtualRowCount,
	});
	useSpreadsheetScrolledX(scrollContainer, stickyFirstColumn);
	const contextValue = useSpreadsheetContextValue({
		stickyHeader,
		sort,
		onSortChange,
		sizing,
		columnSizing,
		onColumnSizingChange,
		setInternalSizing,
		columnOrder,
		onColumnOrderChange,
		onRowMove,
		setDropLine,
		announce: setAnnouncement,
		gridNavigation,
		scrollContainer,
		setVirtualRowCount,
	});
	return (
		<SpreadsheetDesktopTable
			contextValue={contextValue}
			setScrollContainer={setScrollContainer}
			stickyHeader={stickyHeader}
			containerClassName={containerClassName}
			tableClassName={editableTableClassName({
				hasFixedSizing: Object.keys(sizing).length > 0,
				gridNavigation,
				stickyFirstColumn,
				stickyHeader,
				className,
			})}
			// One header row assumed - grid navigation restamps the exact count
			// when enabled.
			ariaRowCount={virtualRowCount === null ? undefined : virtualRowCount + 1}
			dropLine={dropLine}
			announcement={announcement}
			grid={grid}
			tableProps={props}
		/>
	);
}
