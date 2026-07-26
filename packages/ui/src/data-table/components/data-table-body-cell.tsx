import { type Cell, flexRender } from "@tanstack/react-table";
import { pinnedClass, pinnedStyle } from "#/data-table/lib/pinning.ts";
import { Table } from "#/table/components/table.tsx";

interface Props<TData> {
	cell: Cell<TData, unknown>;
	resizable: boolean;
}

/** One body cell — sized and pinned like its header. */
export function DataTableBodyCell<TData>({ cell, resizable }: Props<TData>) {
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
