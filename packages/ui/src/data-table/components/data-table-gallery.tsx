import type { Row } from "@tanstack/react-table";
import type * as React from "react";
import { CardGalleryItem } from "#/card-gallery/components/card-gallery-item.tsx";
import { CardGalleryRoot } from "#/card-gallery/components/card-gallery-root.tsx";
import { DataTableEmpty } from "#/data-table/components/data-table-empty.tsx";
import { DataTableLoadingOverlay } from "#/data-table/components/data-table-loading-overlay.tsx";

interface Props<TData> {
	rows: Row<TData>[];
	loading: boolean;
	emptyState: React.ReactNode;
	onRowClick: ((row: TData) => void) | undefined;
	renderGalleryCard: (row: TData) => React.ReactNode;
}

/** The `CardGallery` grid that replaces the table in gallery view. */
export function DataTableGallery<TData>({
	rows,
	loading,
	emptyState,
	onRowClick,
	renderGalleryCard,
}: Props<TData>) {
	return (
		<div data-slot="data-table-gallery" className="relative">
			<DataTableLoadingOverlay loading={loading} className="rounded-md" />
			{rows.length ? (
				<CardGalleryRoot>
					{rows.map((row) => (
						<CardGalleryItem
							key={row.id}
							render={
								onRowClick ? (
									<button
										type="button"
										onClick={() => onRowClick(row.original)}
									/>
								) : undefined
							}
						>
							{renderGalleryCard(row.original)}
						</CardGalleryItem>
					))}
				</CardGalleryRoot>
			) : (
				<div className="rounded-md border">
					{emptyState ?? <DataTableEmpty />}
				</div>
			)}
		</div>
	);
}
