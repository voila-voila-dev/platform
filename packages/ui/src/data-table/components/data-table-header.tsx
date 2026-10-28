import type {
	HeaderGroup,
	RowData,
	Table as TanstackTable,
} from "@tanstack/react-table";
import { DataTableGroupHeadCell } from "#/data-table/components/data-table-group-head-cell.tsx";
import { DataTableHeadCell } from "#/data-table/components/data-table-head-cell.tsx";
import type { DataTableFeatures } from "#/data-table/lib/features.ts";
import { cn } from "#/lib/utils.ts";
import { Table } from "#/table/components/table.tsx";

interface Props<TData extends RowData> {
	headerGroups: HeaderGroup<DataTableFeatures, TData>[];
	stickyHeader: boolean;
	resizable: boolean;
	table: TanstackTable<DataTableFeatures, TData>;
	expandable: boolean;
	pinned: boolean;
}

/**
 * The table's header rows: one per depth of the column tree. A flat column
 * list is one row; column groups add a caption row above the leaf labels,
 * each caption spanning the columns it groups.
 */
export function DataTableHeader<TData extends RowData>({
	headerGroups,
	stickyHeader,
	resizable,
	table,
	expandable,
	pinned,
}: Props<TData>) {
	return (
		<Table.Header
			className={cn(
				// Sticky headers can't keep collapsed `tr` borders while
				// scrolling, so an inset shadow redraws the bottom rule.
				stickyHeader &&
					"sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)] [&_tr]:border-b-0",
			)}
		>
			{headerGroups.map((headerGroup) => (
				<Table.Row
					key={headerGroup.id}
					className={cn(pinned && "bg-background")}
				>
					{/* The body renders a leading cell for the expander, so the header
					    has to as well or every column sits one place to the left. */}
					{expandable && (
						<Table.Head className="w-10">
							<span className="sr-only">Expand row</span>
						</Table.Head>
					)}
					{headerGroup.headers.map((header) =>
						// The leaf row is the deepest one; every row above it holds
						// group captions (and the placeholders of groupless columns).
						headerGroup.depth < table.getHeaderGroups().length - 1 ? (
							<DataTableGroupHeadCell key={header.id} header={header} />
						) : (
							<DataTableHeadCell
								key={header.id}
								header={header}
								resizable={resizable}
								table={table}
							/>
						),
					)}
				</Table.Row>
			))}
		</Table.Header>
	);
}
