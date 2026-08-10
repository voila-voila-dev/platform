import { DataTableActions } from "#/data-table/components/data-table-actions.tsx";
import { DataTableDensityToggle } from "#/data-table/components/data-table-density-toggle.tsx";
import { DataTableEmpty } from "#/data-table/components/data-table-empty.tsx";
import { DataTableExport } from "#/data-table/components/data-table-export.tsx";
import { DataTableFilters } from "#/data-table/components/data-table-filters.tsx";
import { DataTablePagination } from "#/data-table/components/data-table-pagination.tsx";
import { DataTableRoot } from "#/data-table/components/data-table-root.tsx";
import { DataTableSearch } from "#/data-table/components/data-table-search.tsx";
import { DataTableSelectionBar } from "#/data-table/components/data-table-selection-bar.tsx";
import { DataTableToolbar } from "#/data-table/components/data-table-toolbar.tsx";
import { DataTableViewOptions } from "#/data-table/components/data-table-view-options.tsx";
import { DataTableViewToggle } from "#/data-table/components/data-table-view-toggle.tsx";

// Re-exported so consumers can type their `columns` without depending on
// @tanstack/react-table directly.
export type {
	ColumnDef,
	ColumnOrderState,
	ColumnPinningState,
	ColumnSizingState,
	ExpandedState,
	Row,
	RowSelectionState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";
export type { DataTableDensity } from "#/data-table/lib/density.ts";
export { dataTableSelectionColumn } from "#/data-table/lib/selection-column.tsx";
export { dataTableToCsv } from "#/data-table/lib/to-csv.ts";
export type { DataTableView } from "#/data-table/lib/view.ts";

/**
 * The DataTable parts as one namespace.
 */
export const DataTable = {
	Root: DataTableRoot,
	Actions: DataTableActions,
	DensityToggle: DataTableDensityToggle,
	Empty: DataTableEmpty,
	Export: DataTableExport,
	Filters: DataTableFilters,
	Pagination: DataTablePagination,
	Search: DataTableSearch,
	SelectionBar: DataTableSelectionBar,
	Toolbar: DataTableToolbar,
	ViewOptions: DataTableViewOptions,
	ViewToggle: DataTableViewToggle,
};
