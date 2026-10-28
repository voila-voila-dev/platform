import { PlusIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"button"> {}

/**
 * Full-width "add a row" button for the mobile card mode - pass it through
 * the table's `mobileAddRow` prop, wired like the desktop
 * `SpreadsheetAddRow`.
 */
export function SpreadsheetMobileAddRow({
	className,
	children,
	...props
}: Props) {
	return (
		<button
			type="button"
			data-slot="spreadsheet-mobile-add-row"
			className={cn(
				"flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-input border-dashed px-2.5 text-sm text-muted-foreground outline-none hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<PlusIcon aria-hidden="true" className="size-4" />
			{children}
		</button>
	);
}
