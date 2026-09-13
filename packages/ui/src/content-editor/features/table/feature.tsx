import { DotsThreeOutlineIcon, TableIcon } from "@phosphor-icons/react";
import { insertTable } from "@platejs/table";
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
	TablePlugin,
	TableRowPlugin,
} from "@platejs/table/react";
import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";
import { tableReader } from "#/content-editor/features/table/reader.tsx";
import {
	insideTable,
	tableActions,
} from "#/content-editor/features/table/table-actions.ts";
import {
	TableCellElement,
	TableElement,
	TableHeaderCellElement,
	TableRowElement,
} from "#/content-editor/features/table/table-elements.tsx";

/**
 * Plate's table with what it can do: cell selection by drag, merge and
 * split, column and row resize, a header row, a cell fill. Outside a table
 * the toolbar offers the insert; inside, one menu of the rest, and the
 * table itself shows the same actions above it, whatever the host composed.
 */
export const tableFeature: ContentFeature = {
	...tableReader,
	plugins: () => [
		TablePlugin.configure({ options: { minColumnWidth: 64 } }),
		TableRowPlugin,
		TableCellPlugin,
		TableCellHeaderPlugin,
	],
	components: {
		table: TableElement,
		tr: TableRowElement,
		td: TableCellElement,
		th: TableHeaderCellElement,
	},
	toolbar: [
		{
			key: "table",
			group: "insert",
			icon: TableIcon,
			label: "table",
			isVisible: (editor) => !insideTable(editor),
			run: (editor) =>
				insertTable(
					editor,
					{ rowCount: 3, colCount: 3, header: true },
					{ select: true },
				),
		},
		{
			key: "tableMenu",
			group: "table",
			icon: DotsThreeOutlineIcon,
			label: "tableMenu",
			isVisible: insideTable,
			run: () => {},
			menu: tableActions,
		},
	],
	slash: [
		{
			key: "table",
			icon: TableIcon,
			label: "table",
			keywords: ["table", "grid", "rows", "columns"],
			run: (editor) =>
				insertTable(
					editor,
					{ rowCount: 3, colCount: 3, header: true },
					{ select: true },
				),
		},
	],
};
