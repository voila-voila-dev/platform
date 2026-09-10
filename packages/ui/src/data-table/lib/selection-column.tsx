import type { ColumnDef, RowData } from "@tanstack/react-table";
import { Checkbox } from "#/checkbox/components/checkbox.tsx";
import type { DataTableFeatures } from "#/data-table/lib/features.ts";

interface Options<TData extends RowData> {
	selectAllLabel?: string;
	selectRowLabel?: (row: TData) => string;
}

/**
 * Leading checkbox column wired to the table's row-selection state. Spread it
 * first in `columns` and enable selection on the `DataTable`. Checkbox clicks
 * never bubble into `onRowClick`.
 */
export function dataTableSelectionColumn<TData extends RowData>({
	selectAllLabel = "Select all rows",
	selectRowLabel = () => "Select row",
}: Options<TData> = {}): ColumnDef<DataTableFeatures, TData> {
	return {
		id: "select",
		size: 36,
		enableSorting: false,
		header: ({ table }) => (
			<Checkbox
				aria-label={selectAllLabel}
				checked={table.getIsAllPageRowsSelected()}
				indeterminate={
					table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
				}
				onCheckedChange={(checked) =>
					table.toggleAllPageRowsSelected(checked === true)
				}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				aria-label={selectRowLabel(row.original)}
				checked={row.getIsSelected()}
				disabled={!row.getCanSelect()}
				onCheckedChange={(checked) => row.toggleSelected(checked === true)}
				onClick={(event) => event.stopPropagation()}
			/>
		),
	};
}
