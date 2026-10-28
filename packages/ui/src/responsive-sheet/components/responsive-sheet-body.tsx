import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** The scrolling region between header and footer, gutters included. */
export function ResponsiveSheetBody({ className, ...props }: Props) {
	return (
		<div
			data-slot="responsive-sheet-body"
			className={cn(
				"flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4",
				className,
			)}
			{...props}
		/>
	);
}
