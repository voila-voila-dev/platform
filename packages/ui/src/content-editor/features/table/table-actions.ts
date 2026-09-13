import {
	ColumnsPlusLeftIcon,
	ColumnsPlusRightIcon,
	PaintBucketIcon,
	RowsPlusBottomIcon,
	RowsPlusTopIcon,
	SquareSplitHorizontalIcon,
	TextHOneIcon,
	TrashIcon,
	UniteSquareIcon,
} from "@phosphor-icons/react";
import {
	deleteColumn,
	deleteRow,
	deleteTable,
	getTableEntries,
	insertTableColumn,
	insertTableRow,
	mergeTableCells,
	setCellBackground,
	splitTableCell,
} from "@platejs/table";
import { TablePlugin } from "@platejs/table/react";
import type {
	ContentEditorApi,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";

export function insideTable(editor: ContentEditorApi): boolean {
	return (
		editor.selection !== null && editor.api.some({ match: { type: "table" } })
	);
}

function selectedCells(editor: ContentEditorApi) {
	return editor.getOption(TablePlugin, "selectedCells") ?? undefined;
}

function control(
	key: string,
	icon: ContentToolbarItem["icon"],
	run: (editor: ContentEditorApi) => void,
	extra: Partial<ContentToolbarItem> = {},
): ContentToolbarItem {
	return { key, group: "table", icon, label: key, run, ...extra };
}

/** The first row is the header row when every cell in it is a `th`. */
export function firstRowIsHeader(editor: ContentEditorApi): boolean {
	const entries = getTableEntries(editor);
	const table = entries?.table?.[0] as
		| { children?: Array<{ children?: Array<{ type?: string }> }> }
		| undefined;
	const first = table?.children?.[0]?.children ?? [];
	return first.length > 0 && first.every((cell) => cell.type === "th");
}

export function toggleHeaderRow(editor: ContentEditorApi) {
	const entries = getTableEntries(editor);
	if (entries === undefined) {
		return;
	}
	const [, tablePath] = entries.table;
	const header = firstRowIsHeader(editor);
	const table = entries.table[0] as {
		children: Array<{ children: Array<unknown> }>;
	};
	table.children[0]?.children.forEach((_cell, index) => {
		editor.tf.setNodes({ type: header ? "td" : "th" } as never, {
			at: [...tablePath, 0, index],
		});
	});
}

/** The kit's palette of cell fills; `null` clears the fill. */
const CELL_BACKGROUNDS: ReadonlyArray<{
	readonly key: string;
	readonly color: string | null;
}> = [
	{ key: "noBackground", color: null },
	{ key: "backgroundGray", color: "var(--color-muted)" },
	{
		key: "backgroundYellow",
		color: "color-mix(in oklab, var(--color-warning) 20%, transparent)",
	},
	{
		key: "backgroundGreen",
		color: "color-mix(in oklab, var(--color-success) 20%, transparent)",
	},
	{
		key: "backgroundBlue",
		color: "color-mix(in oklab, var(--color-primary) 15%, transparent)",
	},
	{
		key: "backgroundRed",
		color: "color-mix(in oklab, var(--color-destructive) 15%, transparent)",
	},
];

const rowAndColumnActions: ReadonlyArray<ContentToolbarItem> = [
	control("addRowAbove", RowsPlusTopIcon, (editor) =>
		insertTableRow(editor, { before: true, header: false }),
	),
	control("addRowBelow", RowsPlusBottomIcon, (editor) =>
		insertTableRow(editor, { header: false }),
	),
	control("addColumnLeft", ColumnsPlusLeftIcon, (editor) =>
		insertTableColumn(editor, { before: true }),
	),
	control("addColumnRight", ColumnsPlusRightIcon, (editor) =>
		insertTableColumn(editor),
	),
	control("headerRow", TextHOneIcon, toggleHeaderRow, {
		isActive: firstRowIsHeader,
	}),
	control("mergeCells", UniteSquareIcon, (editor) => mergeTableCells(editor), {
		isDisabled: (editor) => (selectedCells(editor)?.length ?? 0) < 2,
	}),
	control(
		"splitCell",
		SquareSplitHorizontalIcon,
		(editor) => splitTableCell(editor),
		{
			isDisabled: (editor) => {
				const cell = editor.api.above({ match: { type: ["td", "th"] } })?.[0] as
					| { colSpan?: number; rowSpan?: number }
					| undefined;
				return (cell?.colSpan ?? 1) <= 1 && (cell?.rowSpan ?? 1) <= 1;
			},
		},
	),
];

const fillActions: ReadonlyArray<ContentToolbarItem> = [
	...CELL_BACKGROUNDS.map(({ key, color }) =>
		control(key, PaintBucketIcon, (editor) =>
			setCellBackground(editor, {
				color,
				selectedCells: selectedCells(editor),
			}),
		),
	),
];

const deleteActions: ReadonlyArray<ContentToolbarItem> = [
	control("deleteRow", TrashIcon, (editor) => deleteRow(editor)),
	control("deleteColumn", TrashIcon, (editor) => deleteColumn(editor)),
	control("deleteTable", TrashIcon, (editor) => deleteTable(editor)),
];

/** Every action, flat: what the toolbar's table menu lists. */
export const tableActions: ReadonlyArray<ContentToolbarItem> = [
	...rowAndColumnActions,
	...fillActions,
	...deleteActions,
];

/** The same actions as a bar: fills and deletes folded into a menu each. */
export const tableBarItems: ReadonlyArray<ContentToolbarItem> = [
	...rowAndColumnActions,
	{
		key: "cellBackground",
		group: "table",
		icon: PaintBucketIcon,
		label: "cellBackground",
		run: () => {},
		menu: fillActions,
	},
	{
		key: "deleteMenu",
		group: "table",
		icon: TrashIcon,
		label: "deleteMenu",
		run: () => {},
		menu: deleteActions,
	},
];
