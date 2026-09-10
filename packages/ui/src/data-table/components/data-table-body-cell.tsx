import { type Cell, flexRender, type RowData } from "@tanstack/react-table";
import type { DataTableFeatures } from "#/data-table/lib/features.ts";
import { pinnedClass, pinnedStyle } from "#/data-table/lib/pinning.ts";
import { Table } from "#/table/components/table.tsx";

interface Props<TData extends RowData> {
	cell: Cell<DataTableFeatures, TData, unknown>;
	resizable: boolean;
}

/** One body cell — sized and pinned like its header. */
export function DataTableBodyCell<TData extends RowData>({
	cell,
	resizable,
}: Props<TData>) {
	const isSized = cell.column.columnDef.size !== undefined || resizable;
	return (
		<Table.Cell
			className={pinnedClass(cell.column) || undefined}
			style={{
				...(isSized ? { width: cell.column.getSize() } : {}),
				...pinnedStyle(cell.column),
			}}
		>
			<div className={isSized ? "truncate" : undefined}>
				{flexRender(cell.column.columnDef.cell, cell.getContext())}
			</div>
		</Table.Cell>
	);
}
