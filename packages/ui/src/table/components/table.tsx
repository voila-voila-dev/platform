import { TableBody } from "#/table/components/table-body.tsx";
import { TableCaption } from "#/table/components/table-caption.tsx";
import { TableCell } from "#/table/components/table-cell.tsx";
import { TableFooter } from "#/table/components/table-footer.tsx";
import { TableHead } from "#/table/components/table-head.tsx";
import { TableHeader } from "#/table/components/table-header.tsx";
import { TableRoot } from "#/table/components/table-root.tsx";
import { TableRow } from "#/table/components/table-row.tsx";

/**
 * The Table parts as one namespace.
 */
export const Table = {
	Root: TableRoot,
	Body: TableBody,
	Caption: TableCaption,
	Cell: TableCell,
	Footer: TableFooter,
	Head: TableHead,
	Header: TableHeader,
	Row: TableRow,
};
