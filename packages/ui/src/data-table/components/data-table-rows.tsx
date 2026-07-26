import type { Row } from "@tanstack/react-table";
import type * as React from "react";
import { DataTableBodyRow } from "#/data-table/components/data-table-body-row.tsx";
import { DataTableEmpty } from "#/data-table/components/data-table-empty.tsx";
import { Table } from "#/table/components/table.tsx";

interface Props<TData> {
	rows: Row<TData>[];
	columnCount: number;
	emptyState: React.ReactNode;
	onRowClick: ((row: TData) => void) | undefined;
	resizable: boolean;
	renderExpandedRow: ((row: TData) => React.ReactNode) | undefined;
	pinned: boolean;
}

/** The body rows, or the empty state spanning the whole table. */
export function DataTableRows<TData>({
	rows,
	columnCount,
	emptyState,
	onRowClick,
	resizable,
	renderExpandedRow,
	pinned,
}: Props<TData>) {
	if (!rows.length) {
		return (
			<Table.Row>
				<Table.Cell
					colSpan={columnCount + (renderExpandedRow === undefined ? 0 : 1)}
					className="whitespace-normal"
				>
					{emptyState ?? <DataTableEmpty />}
				</Table.Cell>
			</Table.Row>
		);
	}
	return (
		<>
			{rows.map((row) => (
				<DataTableBodyRow
					key={row.id}
					row={row}
					onRowClick={onRowClick}
					resizable={resizable}
					renderExpandedRow={renderExpandedRow}
					columnCount={columnCount}
					pinned={pinned}
				/>
			))}
		</>
	);
}
