import { NestedTableInput } from "#/spreadsheet/components/nested-table-input.tsx";
import { SpreadsheetAddRow } from "#/spreadsheet/components/spreadsheet-add-row.tsx";
import { SpreadsheetBody } from "#/spreadsheet/components/spreadsheet-body.tsx";
import { SpreadsheetCell } from "#/spreadsheet/components/spreadsheet-cell.tsx";
import { SpreadsheetCellImage } from "#/spreadsheet/components/spreadsheet-cell-image.tsx";
import { SpreadsheetCellText } from "#/spreadsheet/components/spreadsheet-cell-text.tsx";
import { SpreadsheetColumn } from "#/spreadsheet/components/spreadsheet-column.tsx";
import { SpreadsheetColumns } from "#/spreadsheet/components/spreadsheet-columns.tsx";
import { SpreadsheetDragHandle } from "#/spreadsheet/components/spreadsheet-drag-handle.tsx";
import { SpreadsheetHead } from "#/spreadsheet/components/spreadsheet-head.tsx";
import { SpreadsheetHeader } from "#/spreadsheet/components/spreadsheet-header.tsx";
import { SpreadsheetMobileAddRow } from "#/spreadsheet/components/spreadsheet-mobile-add-row.tsx";
import { SpreadsheetRoot } from "#/spreadsheet/components/spreadsheet-root.tsx";
import { SpreadsheetRow } from "#/spreadsheet/components/spreadsheet-row.tsx";
import { SpreadsheetRowActions } from "#/spreadsheet/components/spreadsheet-row-actions.tsx";
import { SpreadsheetSkeleton } from "#/spreadsheet/components/spreadsheet-skeleton.tsx";
import { SpreadsheetVirtualRows } from "#/spreadsheet/components/spreadsheet-virtual-rows.tsx";

export type {
	SpreadsheetSort,
	SpreadsheetSortDirection,
} from "#/spreadsheet/context/spreadsheet-context.ts";
export type { SpreadsheetPasteData } from "#/spreadsheet/hooks/use-spreadsheet-grid.ts";

/**
 * The spreadsheet, as one namespace: `Spreadsheet.Root` owns the state and the
 * keyboard grid, every other part draws into it.
 */
export const Spreadsheet = {
	Root: SpreadsheetRoot,
	NestedInput: NestedTableInput,
	Columns: SpreadsheetColumns,
	Column: SpreadsheetColumn,
	Header: SpreadsheetHeader,
	Head: SpreadsheetHead,
	Body: SpreadsheetBody,
	Row: SpreadsheetRow,
	VirtualRows: SpreadsheetVirtualRows,
	Cell: SpreadsheetCell,
	CellText: SpreadsheetCellText,
	CellImage: SpreadsheetCellImage,
	RowActions: SpreadsheetRowActions,
	DragHandle: SpreadsheetDragHandle,
	AddRow: SpreadsheetAddRow,
	MobileAddRow: SpreadsheetMobileAddRow,
	Skeleton: SpreadsheetSkeleton,
};
