import {
	type ColumnDef,
	type ColumnPinningState,
	type ColumnSizingState,
	type ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type OnChangeFn,
	type Row,
	type RowSelectionState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

/** The table-state slice of `DataTable.Root`'s props. */
export interface UseDataTableOptions<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: readonly TData[];
	/** Sorting is managed internally; this seeds the initial column order. */
	initialSorting?: SortingState;
	/** Per-row or table-wide opt-in, forwarded to @tanstack/react-table. */
	enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
	/** Controlled selection state; omit to let the table own it. */
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: (state: RowSelectionState) => void;
	/** Stable row ids for selection across pages; defaults to the row index. */
	getRowId?: (row: TData, index: number) => string;
	/**
	 * Lets the user drag column edges. Widths live in the table's own state, so
	 * `onColumnSizingChange` is only needed to persist them across mounts.
	 */
	enableColumnResizing?: boolean;
	columnSizing?: ColumnSizingState;
	onColumnSizingChange?: (state: ColumnSizingState) => void;
	/** Controlled column visibility; pair with `DataTable.ViewOptions`. */
	columnVisibility?: VisibilityState;
	onColumnVisibilityChange?: (state: VisibilityState) => void;
	/**
	 * Columns frozen against an edge while the rest pans horizontally, by id:
	 * `{ left: ["name"], right: ["actions"] }`.
	 */
	columnPinning?: ColumnPinningState;
	onColumnPinningChange?: (state: ColumnPinningState) => void;
	/**
	 * Detail panel for an expanded row, rendered as a full-width row beneath it.
	 * Rows become expandable and grow a caret in the first cell.
	 */
	renderExpandedRow?: (row: TData) => React.ReactNode;
	/**
	 * Client-side search across every visible cell. Leave undefined for
	 * server-side search (drive `DataTable.Search` yourself instead).
	 */
	globalFilter?: string;
}

/**
 * A piece of state the caller may or may not own. Returns the live value and a
 * TanStack updater that writes to whichever side is in charge, so every feature
 * works uncontrolled by default and controlled when a prop is passed.
 */
function useOptionalControlled<TState>(
	controlled: TState | undefined,
	onChange: ((state: TState) => void) | undefined,
	initial: TState,
): [TState, OnChangeFn<TState>] {
	const [internal, setInternal] = React.useState<TState>(initial);
	const value = controlled ?? internal;
	const handleChange: OnChangeFn<TState> = (updater) => {
		const next =
			typeof updater === "function"
				? (updater as (old: TState) => TState)(value)
				: updater;
		if (controlled === undefined) {
			setInternal(next);
		}
		onChange?.(next);
	};
	return [value, handleChange];
}

/** Builds the TanStack table instance behind `DataTable.Root`. */
export function useDataTable<TData, TValue>({
	columns,
	data,
	initialSorting,
	enableRowSelection,
	rowSelection,
	onRowSelectionChange,
	getRowId,
	enableColumnResizing,
	columnSizing,
	onColumnSizingChange,
	columnVisibility,
	onColumnVisibilityChange,
	columnPinning,
	onColumnPinningChange,
	renderExpandedRow,
	globalFilter,
}: UseDataTableOptions<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>(
		initialSorting ?? [],
	);
	const [selection, handleSelectionChange] = useOptionalControlled(
		rowSelection,
		onRowSelectionChange,
		{} as RowSelectionState,
	);
	const [sizing, handleSizingChange] = useOptionalControlled(
		columnSizing,
		onColumnSizingChange,
		{} as ColumnSizingState,
	);
	const [visibility, handleVisibilityChange] = useOptionalControlled(
		columnVisibility,
		onColumnVisibilityChange,
		{} as VisibilityState,
	);
	const [pinning, handlePinningChange] = useOptionalControlled(
		columnPinning,
		onColumnPinningChange,
		{ left: [], right: [] } as ColumnPinningState,
	);
	const [expanded, setExpanded] = React.useState<ExpandedState>({});

	return useReactTable({
		data: data as TData[],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		onSortingChange: setSorting,
		enableRowSelection,
		onRowSelectionChange: handleSelectionChange,
		enableColumnResizing,
		columnResizeMode: "onChange",
		onColumnSizingChange: handleSizingChange,
		onColumnVisibilityChange: handleVisibilityChange,
		onColumnPinningChange: handlePinningChange,
		onExpandedChange: setExpanded,
		// Every row can open a detail panel when one is supplied; sub-rows are
		// not used, so the row model never nests.
		getRowCanExpand: () => renderExpandedRow !== undefined,
		getRowId,
		state: {
			sorting,
			rowSelection: selection,
			columnSizing: sizing,
			columnVisibility: visibility,
			columnPinning: pinning,
			expanded,
			globalFilter: globalFilter ?? "",
		},
	});
}
