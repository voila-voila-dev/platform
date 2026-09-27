import { DotsThreeOutlineIcon, TableIcon } from "@phosphor-icons/react";
import { insertTable } from "@platejs/table";
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
	TablePlugin,
	TableRowPlugin,
} from "@platejs/table/react";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import {
	createEmailTableNode,
	EmailTablePlugin,
	emailTableActions,
} from "#/content-editor/features/table/email-table.ts";
import {
	EmailTableCellElement,
	EmailTableElement,
	EmailTableHeaderCellElement,
	EmailTableRowElement,
} from "#/content-editor/features/table/email-table-elements.tsx";
import { EmailTableInspector } from "#/content-editor/features/table/email-table-inspector.tsx";
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
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

export interface ContentTableFeatureOptions {
	/**
	 * `document` is Plate's table with everything it can do. `email` is the
	 * table an email can carry, the email block editor's: one line of plain
	 * text per cell, a `headerRow` flag and each column's `align`, and no
	 * merge, fill or resize.
	 */
	readonly mode?: "document" | "email";
}

const MODES = {
	document: {
		disableMerge: false,
		plugins: [],
		components: {
			table: TableElement,
			tr: TableRowElement,
			td: TableCellElement,
			th: TableHeaderCellElement,
		},
		actions: tableActions,
		insert: (editor: ContentEditorApi) =>
			insertTable(
				editor,
				{ rowCount: 3, colCount: 3, header: true },
				{ select: true },
			),
		fields: undefined,
		sections: undefined,
	},
	email: {
		// Merged cells have no place in an email table, and the merge-aware
		// column insert needs the cell indices only the document view tracks.
		disableMerge: true,
		plugins: [EmailTablePlugin],
		components: {
			table: EmailTableElement,
			tr: EmailTableRowElement,
			td: EmailTableCellElement,
			th: EmailTableHeaderCellElement,
		},
		actions: emailTableActions,
		insert: (editor: ContentEditorApi) => {
			const table = createEmailTableNode();
			insertBlockBelow(editor, table);
			const inserted = editor.api.node({ at: [], id: table.id as string });
			if (inserted !== undefined) {
				editor.tf.select([...inserted[1], 0, 0], { edge: "start" });
			}
		},
		sections: { table: EmailTableInspector },
		fields: {
			table: [
				{ type: "boolean", key: "headerRow", label: "tableHeaderRow" },
			] as const,
		},
	},
} as const;

/**
 * Plate's table. Outside a table the toolbar offers the insert; inside, one
 * menu of the rest, and the table itself shows the same actions above it,
 * whatever the host composed.
 */
export function createTableFeature({
	mode = "document",
}: ContentTableFeatureOptions = {}): ContentFeature {
	const {
		disableMerge,
		plugins,
		components,
		actions,
		insert,
		fields,
		sections,
	} = MODES[mode];
	return {
		...tableReader,
		plugins: () => [
			TablePlugin.configure({ options: { minColumnWidth: 64, disableMerge } }),
			TableRowPlugin,
			TableCellPlugin,
			TableCellHeaderPlugin,
			...plugins,
		],
		components,
		fields,
		inspectorSections: sections,
		toolbar: [
			{
				key: "table",
				group: "insert",
				icon: TableIcon,
				label: "table",
				isVisible: (editor) => !insideTable(editor),
				run: insert,
			},
			{
				key: "tableMenu",
				group: "table",
				icon: DotsThreeOutlineIcon,
				label: "tableMenu",
				isVisible: insideTable,
				run: () => {},
				menu: actions,
			},
		],
		slash: [
			{
				key: "table",
				icon: TableIcon,
				label: "table",
				keywords: ["table", "grid", "rows", "columns"],
				run: insert,
			},
		],
	};
}

/** Cell selection by drag, merge and split, resize, a header row, a fill. */
export const tableFeature = createTableFeature();

/** The email block editor's table: see `ContentTableFeatureOptions`. */
export const emailTableFeature = createTableFeature({ mode: "email" });
