import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"td"> {}

/**
 * Trailing cell for per-row actions - put `<Button variant="ghost"
 * size="icon-sm" aria-label=... />` inside.
 */
export function SpreadsheetRowActions({ className, ...props }: Props) {
	return (
		<td
			data-slot="spreadsheet-row-actions"
			className={cn(
				"relative w-0 border-r border-b border-input px-1 text-center align-middle whitespace-nowrap last:border-r-0",
				className,
			)}
			{...props}
		/>
	);
}
