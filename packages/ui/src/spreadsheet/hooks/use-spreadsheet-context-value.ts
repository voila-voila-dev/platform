import * as React from "react";
import type { SpreadsheetContextValue } from "#/spreadsheet/context/spreadsheet-context.ts";

interface Options
	extends Omit<SpreadsheetContextValue, "columnSizing" | "resizeColumn"> {
	sizing: Record<string, number>;
	columnSizing: Record<string, number> | undefined;
	onColumnSizingChange: ((sizing: Record<string, number>) => void) | undefined;
	setInternalSizing: (sizing: Record<string, number>) => void;
}

/**
 * Assembles the memoized context value shared with every part, including the
 * `resizeColumn` writer (internal state unless `columnSizing` is controlled).
 */
export function useSpreadsheetContextValue({
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
	announce,
	gridNavigation,
	scrollContainer,
	setVirtualRowCount,
}: Options) {
	return React.useMemo<SpreadsheetContextValue>(
		() => ({
			stickyHeader,
			sort,
			onSortChange,
			columnSizing: sizing,
			resizeColumn: (columnId, width) => {
				const next = { ...sizing, [columnId]: Math.round(width) };
				if (columnSizing === undefined) {
					setInternalSizing(next);
				}
				onColumnSizingChange?.(next);
			},
			columnOrder,
			onColumnOrderChange,
			onRowMove,
			setDropLine,
			announce,
			gridNavigation,
			scrollContainer,
			setVirtualRowCount,
		}),
		[
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
			announce,
			gridNavigation,
			scrollContainer,
			setVirtualRowCount,
		],
	);
}
