import type { Row, RowData } from "@tanstack/react-table";
import type * as React from "react";
import { DataTableBodyRow } from "#/data-table/components/data-table-body-row.tsx";
import { DataTableEmpty } from "#/data-table/components/data-table-empty.tsx";
import type { DataTableFeatures } from "#/data-table/lib/features.ts";
import { Table } from "#/table/components/table.tsx";

interface Props<TData extends RowData> {
	rows: Row<DataTableFeatures, TData>[];
	columnCount: number;
	emptyState: React.ReactNode;
	onRowClick: ((row: TData) => void) | undefined;
	resizable: boolean;
	renderExpandedRow: ((row: TData) => React.ReactNode) | undefined;
	pinned: boolean;
}

/** The body rows, or the empty state spanning the whole table. */
export function DataTableRows<TData extends RowData>({
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
