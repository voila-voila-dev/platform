import type {
	HeaderGroup,
	Row,
	Table as TanstackTable,
} from "@tanstack/react-table";
import type * as React from "react";
import { DataTableHeader } from "#/data-table/components/data-table-header.tsx";
import { DataTableLoadingOverlay } from "#/data-table/components/data-table-loading-overlay.tsx";
import { DataTableRows } from "#/data-table/components/data-table-rows.tsx";
import {
	type DataTableDensity,
	DENSITY_CELL_CLASS,
} from "#/data-table/lib/density.ts";
import { cn } from "#/lib/utils.ts";
import { Table } from "#/table/components/table.tsx";

interface Props<TData> {
	headerGroups: HeaderGroup<TData>[];
	rows: Row<TData>[];
	columnCount: number;
	loading: boolean;
	emptyState: React.ReactNode;
	onRowClick: ((row: TData) => void) | undefined;
	stickyHeader: boolean;
	containerClassName: string | undefined;
	hasFixedSizes: boolean;
	hiddenOnMobile: boolean;
	resizable: boolean;
	renderExpandedRow: ((row: TData) => React.ReactNode) | undefined;
	density: DataTableDensity;
	table: TanstackTable<TData>;
	pinned: boolean;
}

/** The bordered table itself — everything above the `md` breakpoint. */
export function DataTableDesktopTable<TData>({
	headerGroups,
	rows,
	columnCount,
	loading,
	emptyState,
	onRowClick,
	stickyHeader,
	containerClassName,
	hasFixedSizes,
	hiddenOnMobile,
	resizable,
	renderExpandedRow,
	density,
	table,
	pinned,
}: Props<TData>) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-md border",
				hiddenOnMobile && "hidden md:block",
			)}
		>
			<DataTableLoadingOverlay loading={loading} />
			<Table.Root
				containerClassName={cn(
					stickyHeader && "overflow-y-auto",
					containerClassName,
				)}
				className={DENSITY_CELL_CLASS[density]}
				style={
					hasFixedSizes || resizable ? { tableLayout: "fixed" } : undefined
				}
			>
				<DataTableHeader
					headerGroups={headerGroups}
					stickyHeader={stickyHeader}
					resizable={resizable}
					table={table}
					expandable={renderExpandedRow !== undefined}
					pinned={pinned}
				/>
				<Table.Body>
					<DataTableRows
						rows={rows}
						columnCount={columnCount}
						emptyState={emptyState}
						onRowClick={onRowClick}
						resizable={resizable}
						renderExpandedRow={renderExpandedRow}
						pinned={pinned}
					/>
				</Table.Body>
			</Table.Root>
		</div>
	);
}
