import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"tbody"> {}

export function SpreadsheetBody({ className, ...props }: Props) {
	return (
		<tbody
			data-slot="spreadsheet-body"
			className={cn("[&_tr:last-child>td]:border-b-0", className)}
			{...props}
		/>
	);
}
