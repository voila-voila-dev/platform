import {
	columnFilteringFeature,
	columnPinningFeature,
	columnResizingFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	createExpandedRowModel,
	createFilteredRowModel,
	createSortedRowModel,
	globalFilteringFeature,
	rowExpandingFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_datetime,
	sortFn_text,
	tableFeatures,
} from "@tanstack/react-table";

/**
 * Everything `DataTable.Root` can turn on, registered once. TanStack v9 only
 * exposes an API when its feature is listed here, so this set is the table's
 * capability surface: sorting, global search, an expandable detail row,
 * selection, resizable and hideable columns, and columns frozen to an edge.
 *
 * Order matters where a feature builds on another: global filtering runs on
 * the column-filtering pipeline, resizing on the sizing one, and each row
 * model needs its own feature registered before it.
 *
 * The sort registry is what `sortFn: "auto"` picks from - it samples the first
 * rows and asks for `datetime`, `alphanumeric` or `text` by name, falling back
 * to a basic compare. Registering those three keeps a column's sort matching
 * the type of what it holds without pulling in the rest.
 */
export const dataTableFeatures = tableFeatures({
	columnFilteringFeature,
	globalFilteringFeature,
	rowSortingFeature,
	rowExpandingFeature,
	rowSelectionFeature,
	columnSizingFeature,
	columnResizingFeature,
	columnVisibilityFeature,
	columnPinningFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	expandedRowModel: createExpandedRowModel(),
	sortFns: {
		alphanumeric: sortFn_alphanumeric,
		datetime: sortFn_datetime,
		text: sortFn_text,
	},
});

/**
 * The feature set every kit table type is bound to. TanStack v9 threads the
 * enabled features through its generics, so a column definition handed to
 * `DataTable.Root` reads `ColumnDef<DataTableFeatures, TData, TValue>`.
 */
export type DataTableFeatures = typeof dataTableFeatures;
