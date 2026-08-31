import {
	flexRender,
	type Header,
	type SortDirection,
	type Table as TanstackTable,
} from "@tanstack/react-table";
import { DataTableResizeHandle } from "#/data-table/components/data-table-resize-handle.tsx";
import { DataTableSortCaret } from "#/data-table/components/data-table-sort-caret.tsx";
import {
	PINNED_HEAD_HOVER_CLASS,
	pinnedClass,
	pinnedStyle,
} from "#/data-table/lib/pinning.ts";
import { cn } from "#/lib/utils.ts";
import { Table } from "#/table/components/table.tsx";

interface Props<TData> {
	header: Header<TData, unknown>;
	resizable: boolean;
	table: TanstackTable<TData>;
}

const ARIA_SORT_BY_DIRECTION: Record<
	SortDirection,
	"ascending" | "descending"
> = {
	asc: "ascending",
	desc: "descending",
};

/** One header cell: label, sort affordance and (optionally) a resize handle. */
export function DataTableHeadCell<TData>({
	header,
	resizable,
	table,
}: Props<TData>) {
	const size = header.getSize();
	const isSized = header.column.columnDef.size !== undefined || resizable;
	const canSort = header.column.getCanSort();
	const sorted = header.column.getIsSorted();
	return (
		<Table.Head
			aria-sort={sorted === false ? undefined : ARIA_SORT_BY_DIRECTION[sorted]}
			className={cn(
				"relative",
				canSort && "cursor-pointer select-none hover:bg-muted/50",
				pinnedClass(header.column),
				// Solid hover on a pinned header: translucent would ghost the content
				// sliding beneath through the cell.
				canSort &&
					header.column.getIsPinned() !== false &&
					PINNED_HEAD_HOVER_CLASS,
			)}
			style={{
				...(isSized ? { width: size } : {}),
				...pinnedStyle(header.column),
			}}
			onClick={header.column.getToggleSortingHandler()}
		>
			<div
				className={cn("flex items-center gap-1", isSized && "overflow-hidden")}
			>
				<span className={isSized ? "truncate" : undefined}>
					{header.isPlaceholder
						? null
						: flexRender(header.column.columnDef.header, header.getContext())}
				</span>
				<DataTableSortCaret canSort={canSort} sorted={sorted} />
			</div>
			{resizable && header.column.getCanResize() && (
				<DataTableResizeHandle header={header} table={table} />
			)}
		</Table.Head>
	);
}
