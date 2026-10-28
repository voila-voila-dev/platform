import { ColumnItemPlugin } from "@platejs/layout/react";
import {
	type Descendant,
	ElementApi,
	NodeApi,
	type NodeEntry,
	type Path,
	PathApi,
	type Point,
	RangeApi,
	TextApi,
	type TRange,
} from "platejs";
import { createPlatePlugin, type PlateEditor } from "platejs/react";
import {
	COLUMN_TYPE,
	COLUMNS_DESKTOP_COUNTS,
	COLUMNS_MOBILE_COUNTS,
	COLUMNS_TYPE,
	type ContentColumnsNode,
	freshColumn,
} from "#/content-editor/features/columns/reader.tsx";
import { paragraphNode } from "#/content-editor/features/paragraph/reader.tsx";

const isElementOf = (node: unknown, type: string): boolean =>
	ElementApi.isElement(node) && node.type === type;

const isEmptyColumn = (column: Descendant): boolean =>
	ElementApi.isElement(column) &&
	column.children.length === 1 &&
	ElementApi.isElement(column.children[0]) &&
	column.children[0].type === paragraphNode.type &&
	column.children[0].children.every(
		(child) => TextApi.isText(child) && child.text === "",
	);

const clampTo = <Count extends number>(
	counts: ReadonlyArray<Count>,
	value: number,
): Count =>
	counts.reduce((best, count) =>
		Math.abs(count - value) < Math.abs(best - value) ? count : best,
	);

/**
 * One fix per call, as Slate expects: each change marks the path dirty and
 * brings the node back here until nothing is left to fix.
 *
 * - A row of columns sits at the top level only. Anywhere else (a paste into
 *   a column, a quote) it is unwrapped, and its columns with it.
 * - A column sits in a row only, and holds blocks: a lone column is
 *   unwrapped, an empty one gets a paragraph, loose text is wrapped.
 * - A row holds columns only, as many as `desktopColumns`: a stray block is
 *   wrapped in a column; missing columns are added empty; extra ones are
 *   merged into the last, so no text is lost when the count goes down.
 */
function normalizeColumns(
	editor: PlateEditor,
	[node, path]: NodeEntry,
): boolean {
	if (isElementOf(node, COLUMN_TYPE) && ElementApi.isElement(node)) {
		const parent = editor.api.parent(path);
		if (!isElementOf(parent?.[0], COLUMNS_TYPE)) {
			editor.tf.unwrapNodes({ at: path });
			return true;
		}
		if (node.children.length === 0) {
			editor.tf.insertNodes(paragraphNode.createNode() as never, {
				at: path.concat(0),
			});
			return true;
		}
		const loose = node.children.findIndex(
			(child) => TextApi.isText(child) || editor.api.isInline(child),
		);
		if (loose !== -1) {
			editor.tf.wrapNodes(paragraphNode.createNode({ children: [] }) as never, {
				at: path.concat(loose),
			});
			return true;
		}
		return false;
	}
	if (!isElementOf(node, COLUMNS_TYPE) || !ElementApi.isElement(node)) {
		return false;
	}
	const row = node as unknown as ContentColumnsNode;
	if (path.length > 1) {
		editor.tf.unwrapNodes({ at: path });
		return true;
	}
	if (node.children.length === 0) {
		editor.tf.removeNodes({ at: path });
		return true;
	}
	const stray = node.children.findIndex(
		(child) => !isElementOf(child, COLUMN_TYPE),
	);
	if (stray !== -1) {
		const at = path.concat(stray);
		if (TextApi.isText(node.children[stray])) {
			editor.tf.wrapNodes(paragraphNode.createNode({ children: [] }) as never, {
				at,
			});
		}
		editor.tf.wrapNodes(freshColumn([]) as never, { at });
		return true;
	}
	if (!COLUMNS_DESKTOP_COUNTS.includes(row.desktopColumns)) {
		editor.tf.setNodes(
			{
				desktopColumns: clampTo(
					COLUMNS_DESKTOP_COUNTS,
					Number(row.desktopColumns) || node.children.length,
				),
			} as never,
			{ at: path },
		);
		return true;
	}
	if (!COLUMNS_MOBILE_COUNTS.includes(row.mobileColumns)) {
		editor.tf.setNodes(
			{
				mobileColumns: clampTo(
					COLUMNS_MOBILE_COUNTS,
					Number(row.mobileColumns) || 1,
				),
			} as never,
			{ at: path },
		);
		return true;
	}
	const count = node.children.length;
	if (count < row.desktopColumns) {
		editor.tf.insertNodes(freshColumn() as never, { at: path.concat(count) });
		return true;
	}
	if (count > row.desktopColumns) {
		const extra = path.concat(row.desktopColumns);
		const kept = path.concat(row.desktopColumns - 1);
		const extraNode = node.children[row.desktopColumns] as Descendant;
		const keptNode = node.children[row.desktopColumns - 1] as Descendant;
		editor.tf.withoutNormalizing(() => {
			if (!isEmptyColumn(extraNode)) {
				// An empty kept column gives its paragraph up to what lands in it.
				const keptEmpty = isEmptyColumn(keptNode);
				if (keptEmpty) {
					editor.tf.removeNodes({ at: kept.concat(0) });
				}
				const keptLength = ElementApi.isElement(keptNode)
					? keptNode.children.length
					: 0;
				editor.tf.moveNodes({
					at: extra,
					match: (_, candidate) =>
						candidate.length === extra.length + 1 &&
						PathApi.isParent(extra, candidate),
					to: kept.concat(keptEmpty ? 0 : keptLength),
				});
			}
			editor.tf.removeNodes({ at: extra });
		});
		return true;
	}
	return false;
}

/** The caret at the very start or end of a column. */
function columnEdge(
	editor: PlateEditor,
	edge: "start" | "end",
): Path | undefined {
	const selection = editor.selection;
	if (selection === null || !editor.api.isCollapsed()) {
		return undefined;
	}
	const column = editor.api.above({ match: { type: COLUMN_TYPE } });
	if (column === undefined) {
		return undefined;
	}
	const atEdge =
		edge === "start"
			? editor.api.isStart(selection.anchor, column[1])
			: editor.api.isEnd(selection.anchor, column[1]);
	return atEdge ? column[1] : undefined;
}

/** A range whose ends sit in different columns, or one in a row and one out. */
function crossesColumns(editor: PlateEditor, range: TRange): boolean {
	const [start, end] = RangeApi.edges(range);
	const holder = (at: Point) =>
		editor.api
			.above({ at, match: { type: [COLUMN_TYPE, COLUMNS_TYPE] } })?.[1]
			?.join(".") ?? null;
	return holder(start) !== holder(end);
}

/**
 * Backspace at the start of the block after a row, or Delete at the end of
 * the block before one, would merge that block with a column's. An empty
 * block goes, with the caret put at the row's edge; one with text stays.
 * True when it handled the key.
 */
function stepOverRow(
	editor: PlateEditor,
	direction: "backward" | "forward",
): boolean {
	const selection = editor.selection;
	if (selection === null || !editor.api.isCollapsed()) {
		return false;
	}
	const top = selection.anchor.path.slice(0, 1);
	const index = top[0] ?? 0;
	const neighbour = direction === "backward" ? index - 1 : index + 1;
	const atEdge =
		direction === "backward"
			? editor.api.isStart(selection.anchor, top)
			: editor.api.isEnd(selection.anchor, top);
	if (!atEdge || !isElementOf(editor.children[neighbour], COLUMNS_TYPE)) {
		return false;
	}
	const block = editor.children[index];
	if (block !== undefined && editor.api.isEmpty(block)) {
		editor.tf.removeNodes({ at: top });
		const row = [direction === "backward" ? neighbour : index];
		const edge =
			direction === "backward" ? editor.api.end(row) : editor.api.start(row);
		if (edge !== undefined) {
			editor.tf.select(edge);
		}
	}
	return true;
}

/**
 * The row and its columns. The columns are `@platejs/layout`'s column
 * plugin (a container, strict siblings, ⌘A inside one column first); the
 * row is ours, because layout's own group unwraps a single column and
 * writes a `width` on each, where a row here may hold one column and every
 * column is as wide as the next.
 *
 * Backspace at the start of a column and Delete at its end would merge the
 * text across the column's edge; they do nothing there. A list item still
 * outdents.
 */
export const columnsPlugins = () => [
	ColumnItemPlugin,
	createPlatePlugin({
		key: COLUMNS_TYPE,
		node: { isElement: true, isContainer: true },
	}).overrideEditor(
		({
			editor,
			tf: { normalizeNode, deleteBackward, deleteForward, deleteFragment },
		}) => ({
			transforms: {
				// Chrome hands Backspace at a block's start over as a range
				// across the boundary, which slate-react deletes as a fragment:
				// the same key, so the same rules.
				deleteFragment: (options) => {
					const selection = editor.selection;
					if (
						selection !== null &&
						editor.api.isExpanded() &&
						editor.api.string(selection) === "" &&
						crossesColumns(editor, selection)
					) {
						const [start, end] = RangeApi.edges(selection);
						const backward = options?.direction !== "forward";
						editor.tf.select(backward ? end : start);
						if (backward) {
							editor.tf.deleteBackward("character");
						} else {
							editor.tf.deleteForward("character");
						}
						return;
					}
					deleteFragment(options);
				},
				normalizeNode: (entry, options) => {
					if (normalizeColumns(editor, entry)) {
						return;
					}
					normalizeNode(entry, options);
				},
				deleteBackward: (unit) => {
					const block = editor.api.block();
					const listItem =
						block !== undefined &&
						(block[0] as { listStyleType?: string }).listStyleType !==
							undefined;
					const column = columnEdge(editor, "start");
					if (column !== undefined && block !== undefined && !listItem) {
						// An empty first block goes, as Backspace on an empty line
						// does anywhere else; the column keeps the rest.
						const node = NodeApi.get(editor, column);
						const blocks = ElementApi.isElement(node)
							? node.children.length
							: 0;
						if (blocks > 1 && editor.api.isEmpty(block[0])) {
							editor.tf.removeNodes({ at: block[1] });
							const start = editor.api.start(column);
							if (start !== undefined) {
								editor.tf.select(start);
							}
						}
						return;
					}
					if (stepOverRow(editor, "backward")) {
						return;
					}
					deleteBackward(unit);
				},
				deleteForward: (unit) => {
					if (
						columnEdge(editor, "end") !== undefined ||
						stepOverRow(editor, "forward")
					) {
						return;
					}
					deleteForward(unit);
				},
			},
		}),
	),
];
