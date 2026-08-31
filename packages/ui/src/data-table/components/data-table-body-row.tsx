import { CaretRightIcon as CaretExpandIcon } from "@phosphor-icons/react";
import type { Row } from "@tanstack/react-table";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { DataTableBodyCell } from "#/data-table/components/data-table-body-cell.tsx";
import { PINNED_ROW_STATE_CLASSES } from "#/data-table/lib/pinning.ts";
import { cn } from "#/lib/utils.ts";
import { Table } from "#/table/components/table.tsx";

interface Props<TData> {
	row: Row<TData>;
	onRowClick: ((row: TData) => void) | undefined;
	resizable: boolean;
	renderExpandedRow: ((row: TData) => React.ReactNode) | undefined;
	columnCount: number;
	pinned: boolean;
}

/** One data row, plus its detail panel when expanded. */
export function DataTableBodyRow<TData>({
	row,
	onRowClick,
	resizable,
	renderExpandedRow,
	columnCount,
	pinned,
}: Props<TData>) {
	const handleClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
		// Clicks on interactive cell content (selection checkbox, action
		// buttons, links) are not row activations.
		const target = event.target as HTMLElement;
		if (target.closest("button, a, input, label")) {
			return;
		}
		onRowClick?.(row.original);
	};
	const expandable = renderExpandedRow !== undefined;
	const expanded = expandable && row.getIsExpanded();
	return (
		<>
			<Table.Row
				data-selected={row.getIsSelected() || undefined}
				data-expanded={expanded || undefined}
				className={cn(
					onRowClick && "cursor-pointer",
					// A pinned cell inherits this background, so the row must never be
					// translucent: the solid state washes replace the see-through ones.
					pinned && cn("bg-background", PINNED_ROW_STATE_CLASSES),
				)}
				onClick={onRowClick ? handleClick : undefined}
			>
				{expandable && (
					<Table.Cell className="w-10">
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-expanded={expanded}
							aria-label={expanded ? "Collapse row" : "Expand row"}
							onClick={row.getToggleExpandedHandler()}
						>
							<CaretExpandIcon
								className={cn("transition-transform", expanded && "rotate-90")}
							/>
						</Button>
					</Table.Cell>
				)}
				{row.getVisibleCells().map((cell) => (
					<DataTableBodyCell key={cell.id} cell={cell} resizable={resizable} />
				))}
			</Table.Row>
			{expanded && (
				<Table.Row data-slot="data-table-expanded-row">
					<Table.Cell
						colSpan={columnCount + (expandable ? 1 : 0)}
						className="whitespace-normal bg-muted/30"
					>
						{renderExpandedRow(row.original)}
					</Table.Cell>
				</Table.Row>
			)}
		</>
	);
}
