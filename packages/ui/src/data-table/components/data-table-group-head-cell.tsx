import { flexRender, type Header } from "@tanstack/react-table";
import { pinnedClass, pinnedStyle } from "#/data-table/lib/pinning.ts";
import { cn } from "#/lib/utils.ts";
import { Table } from "#/table/components/table.tsx";

interface Props<TData> {
	header: Header<TData, unknown>;
}

/**
 * The header cell of a column group: a caption spanning its leaf columns.
 *
 * A group has no data of its own, so it neither sorts nor resizes — those
 * affordances stay on the leaf cells beneath it, where the values are. The
 * caption is centred over the span and set lighter than a leaf label, so the
 * two header rows read as "group, then columns" rather than as one row broken
 * in two. A placeholder (the cell a groupless column leaves in the group row)
 * spans its column and says nothing, keeping the grid square.
 */
export function DataTableGroupHeadCell<TData>({ header }: Props<TData>) {
	return (
		<Table.Head
			data-slot="data-table-group-head"
			data-placeholder={header.isPlaceholder ? "" : undefined}
			colSpan={header.colSpan}
			className={cn(
				"h-8 border-b text-center font-medium text-muted-foreground text-xs",
				// A rule where each group starts, so the eye can tell which leaf
				// columns a caption covers; a placeholder draws none.
				"[&:not([data-placeholder])]:border-l",
				pinnedClass(header.column),
			)}
			style={pinnedStyle(header.column)}
		>
			{header.isPlaceholder
				? null
				: flexRender(header.column.columnDef.header, header.getContext())}
		</Table.Head>
	);
}
