import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	rowCount: number | undefined;
	renderMobileRow: (index: number) => React.ReactNode;
	mobileAddRow: React.ReactNode;
}

/** The below-`md` replacement for the table: one card per row. */
export function SpreadsheetMobileList({
	rowCount,
	renderMobileRow,
	mobileAddRow,
	className,
	...props
}: Props) {
	return (
		<div
			data-slot="spreadsheet-mobile-list"
			className={cn("flex flex-col gap-3", className)}
			{...props}
		>
			{rowCount !== undefined && rowCount > 0 ? (
				<ul className="flex flex-col gap-2">
					{Array.from({ length: rowCount }, (_, index) => (
						<li
							// Index keys are safe here: the card fields are controlled by
							// the consumer's row state, never by DOM state.
							key={index}
							data-slot="spreadsheet-mobile-card"
							className="rounded-lg border border-input bg-card p-3"
						>
							{renderMobileRow(index)}
						</li>
					))}
				</ul>
			) : null}
			{mobileAddRow}
		</div>
	);
}
