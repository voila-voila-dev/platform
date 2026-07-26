import type { Row } from "@tanstack/react-table";
import type * as React from "react";
import { DataTableEmpty } from "#/data-table/components/data-table-empty.tsx";
import { DataTableLoadingOverlay } from "#/data-table/components/data-table-loading-overlay.tsx";
import { DataTableMobileCard } from "#/data-table/components/data-table-mobile-card.tsx";

interface Props<TData> {
	rows: Row<TData>[];
	loading: boolean;
	emptyState: React.ReactNode;
	onRowClick: ((row: TData) => void) | undefined;
	renderMobileCard: ((row: TData) => React.ReactNode) | undefined;
}

/** The card list that replaces the table below `md`. */
export function DataTableMobileCardList<TData>({
	rows,
	loading,
	emptyState,
	onRowClick,
	renderMobileCard,
}: Props<TData>) {
	if (renderMobileCard === undefined) {
		return null;
	}
	return (
		<div data-slot="data-table-mobile-list" className="relative md:hidden">
			<DataTableLoadingOverlay loading={loading} className="rounded-md" />
			{rows.length ? (
				<ul className="flex flex-col gap-2">
					{rows.map((row) => (
						<li key={row.id}>
							<DataTableMobileCard
								row={row}
								onRowClick={onRowClick}
								renderMobileCard={renderMobileCard}
							/>
						</li>
					))}
				</ul>
			) : (
				<div className="rounded-md border">
					{emptyState ?? <DataTableEmpty />}
				</div>
			)}
		</div>
	);
}
