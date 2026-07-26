import type { SpreadsheetDropLine } from "#/spreadsheet/hooks/use-spreadsheet-drag.ts";

interface Props {
	dropLine: SpreadsheetDropLine | null;
}

/** Insertion indicator for column/row drags, drawn over the container. */
export function SpreadsheetDropLineIndicator({ dropLine }: Props) {
	if (dropLine === null) {
		return null;
	}
	return (
		<div
			aria-hidden="true"
			data-slot="spreadsheet-drop-line"
			className="pointer-events-none absolute z-20 rounded-full bg-primary"
			style={dropLine}
		/>
	);
}
