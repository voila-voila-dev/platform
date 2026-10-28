import { SquaresFourIcon, TableIcon } from "@phosphor-icons/react";
import type * as React from "react";
import type { DataTableView } from "#/data-table/lib/view.ts";
import { ToggleGroupItem } from "#/toggle-group/components/toggle-group-item.tsx";
import { ToggleGroupRoot } from "#/toggle-group/components/toggle-group-root.tsx";

interface Props
	extends Omit<React.ComponentProps<typeof ToggleGroupRoot>, "value"> {
	/** The current layout. Controlled — this toggle holds no state. */
	view: DataTableView;
	/** Called with the picked layout. Pass the same value to `DataTable.Root`. */
	onViewChange: (view: DataTableView) => void;
	/** Accessible names for the two options. This package ships no translations. */
	labels?: Record<DataTableView, string>;
}

/** Table ⇄ gallery switch, for directories people browse as well as scan. */
export function DataTableViewToggle({
	view,
	onViewChange,
	labels = { table: "Table view", gallery: "Gallery view" },
	...props
}: Props) {
	return (
		<ToggleGroupRoot
			data-slot="data-table-view-toggle"
			variant="outline"
			size="sm"
			value={[view]}
			onValueChange={(groupValue) => {
				const next = groupValue[0];
				if (next !== undefined) {
					onViewChange(next as DataTableView);
				}
			}}
			{...props}
		>
			<ToggleGroupItem value="table" aria-label={labels.table}>
				<TableIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="gallery" aria-label={labels.gallery}>
				<SquaresFourIcon />
			</ToggleGroupItem>
		</ToggleGroupRoot>
	);
}
