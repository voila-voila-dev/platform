import type * as React from "react";

interface Props extends React.ComponentProps<"colgroup"> {}

/** Wraps the `<col>` elements that own every column's width. */
export function SpreadsheetColumns(props: Props) {
	return <colgroup data-slot="spreadsheet-columns" {...props} />;
}
