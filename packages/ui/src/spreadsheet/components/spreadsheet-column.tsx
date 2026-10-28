import * as React from "react";
import { SpreadsheetContext } from "#/spreadsheet/context/spreadsheet-context.ts";

interface Props extends React.ComponentProps<"col"> {
	/** Matches the `columnId` of the header cell that resizes this column. */
	columnId?: string;
	/** Starting width. A resize writes over it, matched by `columnId`. */
	width?: number | string;
}

/**
 * Column widths live on `<col>` elements (not header classes) so column
 * resizing and `table-layout: fixed` have a single place to write to. A
 * resized width (matched by `columnId`) overrides the `width` prop.
 */
export function SpreadsheetColumn({ columnId, width, style, ...props }: Props) {
	const { columnSizing } = React.useContext(SpreadsheetContext);
	const sizedWidth =
		columnId === undefined ? undefined : columnSizing[columnId];
	const finalWidth = sizedWidth ?? width;
	return (
		<col
			data-slot="spreadsheet-column"
			style={finalWidth === undefined ? style : { ...style, width: finalWidth }}
			{...props}
		/>
	);
}
