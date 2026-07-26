import { mergeProps } from "@base-ui/react/merge-props";
import * as React from "react";
import { cn } from "#/lib/utils.ts";
import { SpreadsheetResizeHandle } from "#/spreadsheet/components/spreadsheet-resize-handle.tsx";
import { SpreadsheetSortCaret } from "#/spreadsheet/components/spreadsheet-sort-caret.tsx";
import {
	SpreadsheetContext,
	type SpreadsheetSortDirection,
} from "#/spreadsheet/context/spreadsheet-context.ts";
import { useSpreadsheetColumnReorder } from "#/spreadsheet/hooks/use-spreadsheet-drag.ts";

interface Props extends React.ComponentProps<"th"> {
	/** Stable column identifier for sorting/resizing/reordering. */
	columnId?: string;
	sortable?: boolean;
	resizable?: boolean;
}

const ARIA_SORT_BY_DIRECTION: Record<
	SpreadsheetSortDirection,
	"ascending" | "descending"
> = {
	asc: "ascending",
	desc: "descending",
};

/**
 * `sortable` turns the header into a tri-state sort button (needs `columnId`
 * plus `sort`/`onSortChange` on the table); `resizable` adds a resize handle
 * on the right edge. When the table has a controlled `columnOrder`, any
 * identified header cell also becomes draggable, with Alt+ArrowLeft/Right as
 * the keyboard alternative (a `sortable` head stays pointer-draggable only
 * through that keyboard path: its surface is the sort button).
 */
export function SpreadsheetHead({
	className,
	columnId,
	sortable = false,
	resizable = false,
	children,
	...props
}: Props) {
	const context = React.useContext(SpreadsheetContext);
	const reorder = useSpreadsheetColumnReorder({
		columnId,
		columnOrder: context.columnOrder,
		onColumnOrderChange: context.onColumnOrderChange,
		setDropLine: context.setDropLine,
		announce: context.announce,
	});
	const canSort = sortable && columnId !== undefined;
	const sortDirection =
		canSort && context.sort?.columnId === columnId
			? context.sort.direction
			: undefined;
	return (
		<th
			scope="col"
			data-slot="spreadsheet-head"
			data-column-id={columnId}
			aria-sort={
				sortDirection === undefined
					? undefined
					: ARIA_SORT_BY_DIRECTION[sortDirection]
			}
			tabIndex={reorder.enabled ? 0 : undefined}
			className={cn(
				"h-8 border-r border-b border-input px-2.5 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground last:border-r-0",
				canSort && "p-0",
				resizable && "relative",
				reorder.enabled &&
					"cursor-grab touch-none outline-none select-none focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70",
				className,
			)}
			{...mergeProps<"th">(props, reorder.headProps)}
		>
			{canSort ? (
				<button
					type="button"
					className="flex h-8 w-full items-center gap-1 px-2.5 text-left outline-none hover:bg-muted/50 hover:text-foreground focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70"
					onClick={() => {
						if (context.onSortChange === undefined) {
							return;
						}
						context.onSortChange(
							sortDirection === undefined
								? { columnId, direction: "asc" }
								: sortDirection === "asc"
									? { columnId, direction: "desc" }
									: null,
						);
					}}
				>
					<span className="truncate">{children}</span>
					<SpreadsheetSortCaret direction={sortDirection} />
				</button>
			) : (
				children
			)}
			{resizable && columnId !== undefined ? (
				<SpreadsheetResizeHandle columnId={columnId} />
			) : null}
		</th>
	);
}
