import type * as React from "react";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { SpreadsheetDesktop } from "#/spreadsheet/components/spreadsheet-desktop.tsx";
import { SpreadsheetMobileList } from "#/spreadsheet/components/spreadsheet-mobile-list.tsx";

interface Props extends React.ComponentProps<typeof SpreadsheetDesktop> {
	/** Total number of rows - only read by the mobile card mode. */
	rowCount?: number;
	/**
	 * Card content for one row below the `md` breakpoint. When provided (with
	 * `rowCount`), the table is replaced on mobile by a vertical stack of
	 * cards - a dense grid is not editable with a thumb. Render the SAME
	 * controlled fields in a labelled vertical layout (`Field` + regular
	 * controls, not flattened) plus the row's delete button; `mobileAddRow`
	 * takes over from `SpreadsheetAddRow` under the stack.
	 */
	renderMobileRow?: (index: number) => React.ReactNode;
	/**
	 * Rendered full-width under the mobile card stack - put an
	 * `SpreadsheetMobileAddRow` here, wired like your `SpreadsheetAddRow`.
	 */
	mobileAddRow?: React.ReactNode;
}

/**
 * Spreadsheet-style editable grid: rows of kit form controls (`Input`,
 * `MoneyInput`, `NativeSelect`, `Checkbox`, `Switch`) rendered flush inside
 * dense cells, with the focus/invalid ring drawn on the cell instead of the
 * control. Purely presentational - the consumer owns the row state (an array
 * field, effect-form rows, plain `useState`) and wires each control's
 * controlled contract. Column headers don't label the controls for screen
 * readers: give every control and action button its own `aria-label`.
 * `gridNavigation` layers spreadsheet keyboard semantics (roving cells,
 * range selection, TSV copy/paste) on top - see the prop's doc.
 */
export function SpreadsheetRoot({
	rowCount,
	renderMobileRow,
	mobileAddRow,
	...props
}: Props) {
	const isMobile = useIsMobile();
	if (isMobile && renderMobileRow !== undefined) {
		return (
			<SpreadsheetMobileList
				rowCount={rowCount}
				renderMobileRow={renderMobileRow}
				mobileAddRow={mobileAddRow}
			/>
		);
	}
	return <SpreadsheetDesktop {...props} />;
}
