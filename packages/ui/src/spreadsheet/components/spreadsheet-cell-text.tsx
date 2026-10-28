import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { textCellClassName } from "#/spreadsheet/lib/spreadsheet-styles.ts";

interface Props extends React.ComponentProps<"td"> {}

/** Read-only cell (row labels, computed values) in the same dense grid. */
export function SpreadsheetCellText({ className, ...props }: Props) {
	return (
		<td
			data-slot="spreadsheet-cell-text"
			className={cn(textCellClassName, className)}
			{...props}
		/>
	);
}
