import * as React from "react";
import { cn } from "#/lib/utils.ts";
import { SpreadsheetContext } from "#/spreadsheet/context/spreadsheet-context.ts";
import { useSpreadsheetColumnResize } from "#/spreadsheet/hooks/use-spreadsheet-drag.ts";

interface Props extends React.ComponentProps<"div"> {
	columnId: string;
}

/**
 * Focusable 8px strip on the header cell's right edge. Pointer drag or
 * ArrowLeft/ArrowRight (16px steps) resize the column, writing through the
 * table's `columnSizing`.
 */
export function SpreadsheetResizeHandle({
	columnId,
	className,
	...props
}: Props) {
	const { columnSizing, resizeColumn } = React.useContext(SpreadsheetContext);
	const handleProps = useSpreadsheetColumnResize({
		width: columnSizing[columnId],
		onWidthChange: (width) => resizeColumn(columnId, width),
	});
	return (
		<div
			data-slot="spreadsheet-resize-handle"
			role="separator"
			aria-orientation="vertical"
			aria-label="Resize column"
			tabIndex={0}
			className={cn(
				"absolute top-0 right-0 z-10 h-full w-2 cursor-col-resize touch-none outline-none select-none after:absolute after:top-1/2 after:right-px after:h-4 after:w-0.5 after:-translate-y-1/2 after:rounded-full after:bg-transparent hover:after:bg-ring focus-visible:after:bg-ring",
				className,
			)}
			{...props}
			{...handleProps}
		/>
	);
}
