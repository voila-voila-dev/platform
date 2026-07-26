import type { Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";
import { DataTableDesktopTable } from "#/data-table/components/data-table-desktop-table.tsx";
import { DataTableMobileCardList } from "#/data-table/components/data-table-mobile-card-list.tsx";
import { DataTablePagination } from "#/data-table/components/data-table-pagination.tsx";
import {
	type UseDataTableOptions,
	useDataTable,
} from "#/data-table/hooks/use-data-table.ts";
import type { DataTableDensity } from "#/data-table/lib/density.ts";

interface Props<TData, TValue>
	extends UseDataTableOptions<TData, TValue>,
		Omit<React.ComponentProps<"div">, "children"> {
	/** When set, rows become clickable and invoke this with the row's data. */
	onRowClick?: (row: TData) => void;
	/** Refetch in progress: keeps the current rows visible under a spinner. */
	loading?: boolean;
	/** Custom empty state; defaults to a generic "No results" block. */
	emptyState?: React.ReactNode;
	/** Server-side pagination footer rendered below the table. */
	pagination?: React.ComponentProps<typeof DataTablePagination>;
	/**
	 * Emplacement rendered above the table - compose `DataTable.Toolbar` with
	 * `DataTable.Search`, `DataTable.Filters` and `DataTable.Actions`.
	 */
	toolbar?:
		| React.ReactNode
		| ((table: TanstackTable<TData>) => React.ReactNode);
	/**
	 * Keeps the header row visible while the body scrolls. Needs a bounded
	 * height on the scroll container - pass e.g. `max-h-96` through
	 * `containerClassName`.
	 */
	stickyHeader?: boolean;
	/** Forwarded to the underlying `Table` scroll container. */
	containerClassName?: string;
	/**
	 * Card content for one row on mobile. When provided, the table is replaced
	 * below the `md` breakpoint by a vertical list of cards (no horizontal
	 * scroll) built from the sorted row model; cards stay clickable through
	 * `onRowClick`. The toolbar and pagination footer remain visible.
	 */
	renderMobileCard?: (row: TData) => React.ReactNode;
	/** Row height. `compact` fits about a third more rows on a screen. */
	density?: DataTableDensity;
}

/**
 * The kit's table recipe: `Table` + sorting + row selection + sticky header +
 * windowed pagination, with toolbar emplacements for search and filters, and
 * the classic extras behind opt-in props — column resizing, visibility,
 * pinning, density, row expansion and CSV export.
 *
 * Column sizing: when any column sets a numeric `size` (or resizing is on) the
 * table switches to fixed layout and sized cells truncate instead of
 * stretching.
 *
 * `toolbar` is a render prop when it needs the table instance — the controls
 * that drive columns (`DataTable.ViewOptions`, `DataTable.Export`) do.
 */
export function DataTableRoot<TData, TValue>({
	columns,
	data,
	initialSorting,
	onRowClick,
	loading = false,
	emptyState,
	pagination,
	toolbar,
	enableRowSelection = false,
	rowSelection,
	onRowSelectionChange,
	getRowId,
	stickyHeader = false,
	containerClassName,
	renderMobileCard,
	enableColumnResizing = false,
	columnSizing,
	onColumnSizingChange,
	columnVisibility,
	onColumnVisibilityChange,
	columnPinning,
	onColumnPinningChange,
	density = "comfortable",
	renderExpandedRow,
	globalFilter,
	className,
	...props
}: Props<TData, TValue>) {
	const table = useDataTable({
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
	});

	const hasFixedSizes = columns.some(
		(column) => typeof column.size === "number",
	);
	const rows = table.getRowModel().rows;

	return (
		<div data-slot="data-table" className={className} {...props}>
			{toolbar !== undefined && (
				<div className="pb-3">
					{typeof toolbar === "function" ? toolbar(table) : toolbar}
				</div>
			)}
			<DataTableMobileCardList
				rows={rows}
				loading={loading}
				emptyState={emptyState}
				onRowClick={onRowClick}
				renderMobileCard={renderMobileCard}
			/>
			<DataTableDesktopTable
				headerGroups={table.getHeaderGroups()}
				rows={rows}
				columnCount={table.getVisibleLeafColumns().length}
				loading={loading}
				emptyState={emptyState}
				onRowClick={onRowClick}
				stickyHeader={stickyHeader}
				containerClassName={containerClassName}
				hasFixedSizes={hasFixedSizes}
				hiddenOnMobile={renderMobileCard !== undefined}
				resizable={enableColumnResizing}
				renderExpandedRow={renderExpandedRow}
				density={density}
				table={table}
				pinned={
					(columnPinning?.left?.length ?? 0) +
						(columnPinning?.right?.length ?? 0) >
					0
				}
			/>
			{pagination !== undefined && <DataTablePagination {...pagination} />}
		</div>
	);
}
