import { Skeleton } from "#/skeleton/components/skeleton.tsx";
import { SpreadsheetCellText } from "#/spreadsheet/components/spreadsheet-cell-text.tsx";
import { SpreadsheetRow } from "#/spreadsheet/components/spreadsheet-row.tsx";

interface Props {
	rows?: number;
	columns: number;
}

/**
 * Loading placeholder rows, sized exactly like real rows (32px + 1px rule) so
 * the swap to live data causes no layout shift. Renders inside
 * `SpreadsheetBody`; the rows are `aria-hidden`, announce the load
 * elsewhere (e.g. a `role="status"` region near the table).
 */
export function SpreadsheetSkeleton({ rows = 3, columns }: Props) {
	return (
		<>
			{Array.from({ length: rows }, (_, rowIndex) => (
				<SpreadsheetRow
					key={rowIndex}
					aria-hidden="true"
					data-slot="spreadsheet-skeleton-row"
				>
					{Array.from({ length: columns }, (_, columnIndex) => (
						<SpreadsheetCellText key={columnIndex}>
							<Skeleton className="h-5 w-full" />
						</SpreadsheetCellText>
					))}
				</SpreadsheetRow>
			))}
		</>
	);
}
