import { PlusIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"button"> {
	/** Must count ALL columns, the drag-handle and actions columns included. */
	colSpan: number;
}

/**
 * Full-width "add a row" affordance rendered as the table's last row.
 * `colSpan` must count ALL columns, the actions column included. All props
 * (`className` included) go to the inner `<button>`; the wrapping row and
 * cell are not styleable from the outside.
 */
export function SpreadsheetAddRow({
	colSpan,
	className,
	children,
	...props
}: Props) {
	return (
		<tr data-slot="spreadsheet-add-row">
			<td colSpan={colSpan} className="border-t border-input p-0">
				<button
					type="button"
					className={cn(
						"flex h-8 w-full items-center gap-2 px-2.5 text-sm text-muted-foreground outline-none hover:bg-muted/50 hover:text-foreground focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70 disabled:pointer-events-none disabled:opacity-50",
						className,
					)}
					{...props}
				>
					<PlusIcon aria-hidden="true" className="size-4" />
					{children}
				</button>
			</td>
		</tr>
	);
}
