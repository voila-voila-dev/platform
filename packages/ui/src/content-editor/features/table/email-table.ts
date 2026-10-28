import {
	ColumnsPlusLeftIcon,
	ColumnsPlusRightIcon,
	RowsPlusBottomIcon,
	RowsPlusTopIcon,
	TextAlignLeftIcon,
	TextAlignRightIcon,
	TextHOneIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import {
	deleteColumn,
	deleteRow,
	deleteTable,
	getTableEntries,
	insertTableColumn,
	insertTableRow,
} from "@platejs/table";
import { ElementApi, type Path, TextApi } from "platejs";
import { createPlatePlugin } from "platejs/react";
import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentEditorApi,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";
import { paragraphNode } from "#/content-editor/features/paragraph/reader.tsx";
import {
	type ContentTableColumn,
	type ContentTableColumnAlign,
	type ContentTableNode,
	plainText,
} from "#/content-editor/features/table/reader.tsx";
import { variablePlaceholder } from "#/content-editor/features/variable/reader.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";

const CELL_TYPES = ["td", "th"];

const cell = (type: "td" | "th"): ContentNodeLike => ({
	type,
	children: [paragraphNode.createNode()],
});

/** The email block editor's new table: two columns, left then right, titled. */
export function createEmailTableNode(): ContentTableNode {
	return {
		id: newContentNodeId(),
		type: "table",
		columns: [{ align: "left" }, { align: "right" }],
		headerRow: true,
		children: [
			{ type: "tr", children: [cell("th"), cell("th")] },
			{ type: "tr", children: [cell("td"), cell("td")] },
		],
	};
}

function currentTable(editor: ContentEditorApi) {
	const entries = getTableEntries(editor);
	if (entries === undefined) {
		return undefined;
	}
	const [node, path] = entries.table;
	return {
		node: node as unknown as ContentTableNode,
		path,
		column: entries.cell[1].at(-1) ?? 0,
	};
}

function setColumns(
	editor: ContentEditorApi,
	path: Path,
	columns: ReadonlyArray<ContentTableColumn>,
) {
	editor.tf.setNodes({ columns } as never, { at: path });
}

function columnAlign(editor: ContentEditorApi): ContentTableColumnAlign | null {
	const table = currentTable(editor);
	return table === undefined
		? null
		: (table.node.columns?.[table.column]?.align ?? "left");
}

function alignColumn(editor: ContentEditorApi, align: ContentTableColumnAlign) {
	const table = currentTable(editor);
	if (table === undefined) {
		return;
	}
	setColumns(
		editor,
		table.path,
		(table.node.columns ?? []).map((column, index) =>
			index === table.column ? { ...column, align } : column,
		),
	);
}

/** Inserts or deletes a column and moves the alignments with it. */
function changeColumns(
	editor: ContentEditorApi,
	change: (columns: ContentTableColumn[], at: number) => void,
	transform: () => void,
) {
	const table = currentTable(editor);
	if (table === undefined) {
		return;
	}
	const columns = [...(table.node.columns ?? [])];
	change(columns, table.column);
	editor.tf.withoutNormalizing(() => {
		transform();
		setColumns(editor, table.path, columns);
	});
}

function toggleHeaderRow(editor: ContentEditorApi) {
	const table = currentTable(editor);
	if (table !== undefined) {
		editor.tf.setNodes({ headerRow: table.node.headerRow !== true } as never, {
			at: table.path,
		});
	}
}

function action(
	key: string,
	icon: ContentToolbarItem["icon"],
	run: (editor: ContentEditorApi) => void,
	extra: Partial<ContentToolbarItem> = {},
): ContentToolbarItem {
	return { key, group: "table", icon, label: key, run, ...extra };
}

const rowAndColumnActions: ReadonlyArray<ContentToolbarItem> = [
	action("addRowAbove", RowsPlusTopIcon, (editor) =>
		insertTableRow(editor, { before: true, header: false, select: true }),
	),
	action("addRowBelow", RowsPlusBottomIcon, (editor) =>
		insertTableRow(editor, { header: false, select: true }),
	),
	action("addColumnLeft", ColumnsPlusLeftIcon, (editor) =>
		changeColumns(
			editor,
			(columns, at) => columns.splice(at, 0, { align: "left" }),
			() => insertTableColumn(editor, { before: true, select: true }),
		),
	),
	action("addColumnRight", ColumnsPlusRightIcon, (editor) =>
		changeColumns(
			editor,
			(columns, at) => columns.splice(at + 1, 0, { align: "left" }),
			() => insertTableColumn(editor, { select: true }),
		),
	),
	action("headerRow", TextHOneIcon, toggleHeaderRow, {
		isActive: (editor) => currentTable(editor)?.node.headerRow === true,
	}),
	action(
		"alignColumnLeft",
		TextAlignLeftIcon,
		(editor) => alignColumn(editor, "left"),
		{ isActive: (editor) => columnAlign(editor) === "left" },
	),
	action(
		"alignColumnRight",
		TextAlignRightIcon,
		(editor) => alignColumn(editor, "right"),
		{ isActive: (editor) => columnAlign(editor) === "right" },
	),
];

const deleteActions: ReadonlyArray<ContentToolbarItem> = [
	action("deleteRow", TrashIcon, (editor) => deleteRow(editor)),
	action("deleteColumn", TrashIcon, (editor) =>
		changeColumns(
			editor,
			(columns, at) => columns.splice(at, 1),
			() => deleteColumn(editor),
		),
	),
	action("deleteTable", TrashIcon, (editor) => deleteTable(editor)),
];

/** Every email table action, flat: what the toolbar's table menu lists. */
export const emailTableActions: ReadonlyArray<ContentToolbarItem> = [
	...rowAndColumnActions,
	...deleteActions,
];

/** The same actions as a bar, the deletes folded into a menu. */
export const emailTableBarItems: ReadonlyArray<ContentToolbarItem> = [
	...rowAndColumnActions,
	{
		key: "deleteMenu",
		group: "table",
		icon: TrashIcon,
		label: "deleteMenu",
		run: () => {},
		menu: deleteActions,
	},
];

/** A cell's paragraph keeps its type and id and nothing else. */
const PARAGRAPH_KEYS = new Set(["type", "id", "children"]);

/**
 * Fixes the first thing wrong with an email table and lets normalization
 * run again, so each fix is one small step: `columns` matches the column
 * count, the first row is `th` exactly when `headerRow`, no column widths.
 */
function normalizeTable(
	editor: ContentEditorApi,
	table: ContentTableNode,
	path: Path,
): boolean {
	const rows = table.children as ReadonlyArray<ContentNodeLike>;
	const width = Math.max(0, ...rows.map((row) => row.children.length));
	const columns = Array.isArray(table.columns) ? table.columns : [];
	if (!Array.isArray(table.columns) || columns.length !== width) {
		setColumns(
			editor,
			path,
			Array.from({ length: width }, (_, index) => ({
				align: columns[index]?.align ?? "left",
			})),
		);
		return true;
	}
	if (typeof table.headerRow !== "boolean") {
		const first = rows[0]?.children ?? [];
		editor.tf.setNodes(
			{
				headerRow:
					first.length > 0 &&
					first.every((child) => (child as ContentNodeLike).type === "th"),
			} as never,
			{ at: path },
		);
		return true;
	}
	if (table.colSizes !== undefined) {
		editor.tf.unsetNodes("colSizes", { at: path });
		return true;
	}
	for (const [rowIndex, row] of rows.entries()) {
		const expected = table.headerRow && rowIndex === 0 ? "th" : "td";
		for (const [cellIndex, child] of row.children.entries()) {
			if ((child as ContentNodeLike).type !== expected) {
				editor.tf.setNodes({ type: expected } as never, {
					at: [...path, rowIndex, cellIndex],
				});
				return true;
			}
		}
	}
	return false;
}

/** A cell holds one paragraph of plain text: no marks, no links, no fills. */
function normalizeCell(
	editor: ContentEditorApi,
	cellNode: ContentNodeLike,
	path: Path,
): boolean {
	if (cellNode.background !== undefined) {
		editor.tf.unsetNodes("background", { at: path });
		return true;
	}
	const [first] = cellNode.children;
	if (
		cellNode.children.length !== 1 ||
		first === undefined ||
		TextApi.isText(first) ||
		(first as ContentNodeLike).type !== paragraphNode.type
	) {
		const text = plainText(cellNode);
		editor.tf.withoutNormalizing(() => {
			for (let index = cellNode.children.length - 1; index >= 0; index--) {
				editor.tf.removeNodes({ at: [...path, index] });
			}
			editor.tf.insertNodes(
				paragraphNode.createNode({ children: [{ text }] }) as never,
				{ at: [...path, 0] },
			);
		});
		return true;
	}
	const paragraph = first as ContentNodeLike;
	const extra = Object.keys(paragraph).filter(
		(key) => !PARAGRAPH_KEYS.has(key),
	);
	if (extra.length > 0) {
		editor.tf.unsetNodes(extra, { at: [...path, 0] });
		return true;
	}
	for (const [index, child] of paragraph.children.entries()) {
		const at = [...path, 0, index];
		if (TextApi.isText(child)) {
			const marks = Object.keys(child).filter((key) => key !== "text");
			if (marks.length > 0) {
				editor.tf.unsetNodes(marks, { at });
				return true;
			}
			continue;
		}
		if (ElementApi.isElement(child)) {
			const inline = child as ContentNodeLike;
			if (inline.type === "variable" && typeof inline.name === "string") {
				editor.tf.withoutNormalizing(() => {
					editor.tf.removeNodes({ at });
					editor.tf.insertNodes(
						{ text: variablePlaceholder(inline.name as string) } as never,
						{ at },
					);
				});
			} else {
				editor.tf.unwrapNodes({ at });
			}
			return true;
		}
	}
	return false;
}

/**
 * The email mode: the table the email block editor had. Cells are one line
 * of plain text, so Enter and Shift+Enter do nothing inside one, and
 * whatever is pasted in is flattened to its text.
 */
export const EmailTablePlugin = createPlatePlugin({
	key: "email-table",
}).overrideEditor(
	({ editor, tf: { normalizeNode, insertBreak, insertSoftBreak } }) => {
		const inCell = () =>
			editor.api.above({ match: { type: CELL_TYPES } }) !== undefined;
		return {
			transforms: {
				insertBreak: () => {
					if (!inCell()) {
						insertBreak();
					}
				},
				insertSoftBreak: () => {
					if (!inCell()) {
						insertSoftBreak();
					}
				},
				normalizeNode: (entry, options) => {
					const [node, path] = entry;
					if (ElementApi.isElement(node)) {
						const element = node as unknown as ContentNodeLike;
						const fixed =
							element.type === "table"
								? normalizeTable(
										editor as unknown as ContentEditorApi,
										element as ContentTableNode,
										path,
									)
								: CELL_TYPES.includes(element.type)
									? normalizeCell(
											editor as unknown as ContentEditorApi,
											element,
											path,
										)
									: false;
						if (fixed) {
							return;
						}
					}
					normalizeNode(entry, options);
				},
			},
		};
	},
);
