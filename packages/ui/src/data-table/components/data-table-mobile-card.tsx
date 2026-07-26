import type { Row } from "@tanstack/react-table";
import type * as React from "react";

interface Props<TData> {
	row: Row<TData>;
	onRowClick: ((row: TData) => void) | undefined;
	renderMobileCard: (row: TData) => React.ReactNode;
}

/** One row as a card — a button when rows are clickable, a plain box otherwise. */
export function DataTableMobileCard<TData>({
	row,
	onRowClick,
	renderMobileCard,
}: Props<TData>) {
	if (onRowClick) {
		return (
			<button
				type="button"
				className="w-full rounded-md border bg-card p-3 text-left active:bg-muted/50"
				onClick={() => onRowClick(row.original)}
			>
				{renderMobileCard(row.original)}
			</button>
		);
	}
	return (
		<div className="rounded-md border bg-card p-3">
			{renderMobileCard(row.original)}
		</div>
	);
}
