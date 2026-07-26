import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import * as React from "react";
import { cn } from "#/lib/utils.ts";
import { SpreadsheetContext } from "#/spreadsheet/context/spreadsheet-context.ts";
import { useSpreadsheetRowDrag } from "#/spreadsheet/hooks/use-spreadsheet-drag.ts";

interface Props extends React.ComponentProps<"td"> {
	index: number;
}

/**
 * Grab-handle cell for row reordering; needs `onRowMove` on the table and the
 * row's current `index`. Pointer: drag the handle vertically, a drop line
 * marks the target. Keyboard: Space grabs the row, ArrowUp/ArrowDown pick the
 * position, Space drops, Escape cancels (steps are announced politely).
 * Render it as the row's first cell so the handle stays predictable.
 */
export function SpreadsheetDragHandle({
	index,
	className,
	"aria-label": ariaLabel = "Reorder row",
	...props
}: Props) {
	const { onRowMove, setDropLine, announce } =
		React.useContext(SpreadsheetContext);
	const buttonProps = useSpreadsheetRowDrag({
		index,
		onRowMove,
		setDropLine,
		announce,
	});
	return (
		<td
			data-slot="spreadsheet-drag-handle"
			className={cn(
				"relative w-0 border-r border-b border-input p-0 text-center align-middle last:border-r-0",
				className,
			)}
			{...props}
		>
			<button
				type="button"
				aria-label={ariaLabel}
				aria-roledescription="sortable row"
				className="flex h-8 w-full min-w-7 cursor-grab touch-none items-center justify-center text-muted-foreground outline-none select-none hover:text-foreground focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70 active:cursor-grabbing data-[grabbed=true]:text-foreground"
				{...buttonProps}
			>
				<DotsSixVerticalIcon aria-hidden="true" className="size-4" />
			</button>
		</td>
	);
}
