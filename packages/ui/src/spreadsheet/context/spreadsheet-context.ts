import * as React from "react";
import type { SpreadsheetDropLine } from "#/spreadsheet/hooks/use-spreadsheet-drag.ts";

export type SpreadsheetSortDirection = "asc" | "desc";

export interface SpreadsheetSort {
	columnId: string;
	direction: SpreadsheetSortDirection;
}

export interface SpreadsheetContextValue {
	stickyHeader: boolean;
	sort: SpreadsheetSort | null;
	onSortChange: ((sort: SpreadsheetSort | null) => void) | undefined;
	columnSizing: Record<string, number>;
	resizeColumn: (columnId: string, width: number) => void;
	columnOrder: readonly string[] | undefined;
	onColumnOrderChange: ((order: string[]) => void) | undefined;
	onRowMove: ((fromIndex: number, toIndex: number) => void) | undefined;
	setDropLine: (line: SpreadsheetDropLine | null) => void;
	announce: (message: string) => void;
	gridNavigation: boolean;
	/**
	 * The scroll container as STATE (callback ref), not a ref object: it lands
	 * after the initial commit, and the state change re-renders
	 * `SpreadsheetVirtualRows` so the virtualizer sees its scroll element -
	 * a plain ref would stay null in its first layout effect (descendant
	 * effects run before parent refs attach) with no re-render to recover.
	 */
	scrollContainer: HTMLDivElement | null;
	setVirtualRowCount: (count: number | null) => void;
}

export const SpreadsheetContext = React.createContext<SpreadsheetContextValue>({
	stickyHeader: false,
	sort: null,
	onSortChange: undefined,
	columnSizing: {},
	resizeColumn: () => {},
	columnOrder: undefined,
	onColumnOrderChange: undefined,
	onRowMove: undefined,
	setDropLine: () => {},
	announce: () => {},
	gridNavigation: false,
	scrollContainer: null,
	setVirtualRowCount: () => {},
});

/**
 * Absolute row index injected by `SpreadsheetVirtualRows` so each mounted
 * `SpreadsheetRow` can stamp `data-index`/`aria-rowindex` itself - grid
 * navigation and screen readers keep working over the unmounted rows.
 */
export const SpreadsheetRowIndexContext = React.createContext<number | null>(
	null,
);
