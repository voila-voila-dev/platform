import * as React from "react";
import { cn } from "#/lib/utils.ts";
import { SpreadsheetRowIndexContext } from "#/spreadsheet/context/spreadsheet-context.ts";

interface Props extends React.ComponentProps<"tr"> {
	/**
	 * Draws the invalid ring on the row's cells. The row is the right place for
	 * it: the controls inside sit on transparent backgrounds.
	 */
	invalid?: boolean;
}

/**
 * No hover background on purpose: the controls sit on transparent
 * backgrounds, so a row tint would bleed into every field.
 */
export function SpreadsheetRow({ className, invalid, ...props }: Props) {
	const virtualIndex = React.useContext(SpreadsheetRowIndexContext);
	return (
		<tr
			data-slot="spreadsheet-row"
			data-index={virtualIndex ?? undefined}
			// 1-based, after the (single assumed) header row; grid navigation
			// restamps with the exact header count when enabled.
			aria-rowindex={virtualIndex === null ? undefined : virtualIndex + 2}
			data-invalid={invalid || undefined}
			className={cn("group/editable-row", className)}
			{...props}
		/>
	);
}
