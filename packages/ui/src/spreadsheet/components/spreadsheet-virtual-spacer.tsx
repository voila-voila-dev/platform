import type * as React from "react";

interface Props extends React.ComponentProps<"tr"> {
	height: number;
}

/** Keeps the scrollbar honest for the unmounted rows above/below the window. */
export function SpreadsheetVirtualSpacer({ height, ...props }: Props) {
	if (height <= 0) {
		return null;
	}
	return (
		<tr data-slot="spreadsheet-virtual-spacer" {...props}>
			<td
				aria-hidden="true"
				colSpan={1000}
				className="border-0 p-0"
				style={{ height }}
			/>
		</tr>
	);
}
