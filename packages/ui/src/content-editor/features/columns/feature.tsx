import { ColumnsIcon } from "@phosphor-icons/react";
import {
	ColumnElement,
	ColumnsInspector,
	ColumnsView,
} from "#/content-editor/features/columns/columns-elements.tsx";
import { columnsPlugins } from "#/content-editor/features/columns/columns-plugin.ts";
import {
	COLUMN_TYPE,
	COLUMNS_DESKTOP_COUNTS,
	COLUMNS_MOBILE_COUNTS,
	type ContentColumnsNode,
	columnNode,
	columnsNode,
	freshColumns,
} from "#/content-editor/features/columns/reader.tsx";
import type {
	ContentEditorApi,
	ContentSlashItem,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";
import { paragraphNode } from "#/content-editor/features/paragraph/reader.tsx";
import { defineElementFeature } from "#/content-editor/lib/define-element-feature.ts";

/**
 * Inserts a row of two columns with the caret in the first. The row never
 * splits the block the caret is in: it takes the place of an empty line
 * (the one the slash was typed on), or goes after the top-level block,
 * which from inside a column is the row around it, since a column holds
 * leaves only. A line follows the row when nothing else would, for the
 * caret to leave it for.
 */
function insertColumns(editor: ContentEditorApi) {
	const row = freshColumns();
	const index = editor.selection?.anchor.path[0];
	const top = index === undefined ? undefined : editor.children[index];
	const replacesEmptyLine =
		top !== undefined &&
		top.type === paragraphNode.type &&
		editor.api.isEmpty(top);
	const at = index === undefined ? editor.children.length : index + 1;
	editor.tf.withoutNormalizing(() => {
		if (replacesEmptyLine) {
			editor.tf.insertNodes(row as never, { at: [index as number] });
		} else {
			// A row straight against the next leaves no line to type between.
			const next = editor.children[at];
			const needsLine = next === undefined || next.type === columnsNode.type;
			editor.tf.insertNodes(
				(needsLine ? [row, paragraphNode.createNode()] : [row]) as never,
				{ at: [at] },
			);
		}
	});
	const inserted = editor.api.node({ at: [], match: { id: row.id } });
	const start =
		inserted === undefined ? undefined : editor.api.start(inserted[1]);
	if (start !== undefined) {
		editor.tf.select(start);
		editor.tf.focus();
	}
}

const defined = defineElementFeature<ContentColumnsNode>({
	key: "columns",
	kind: "container",
	node: columnsNode,
	fields: [
		{
			type: "select",
			key: "desktopColumns",
			label: "columnsDesktop",
			options: COLUMNS_DESKTOP_COUNTS.map((count) => ({
				value: count,
				label: String(count),
			})),
		},
		{
			type: "select",
			key: "mobileColumns",
			label: "columnsMobile",
			description: "columnsMobileDescription",
			options: COLUMNS_MOBILE_COUNTS.map((count) => ({
				value: count,
				label: String(count),
			})),
		},
	],
	defaults: { desktopColumns: 2, mobileColumns: 1 },
	view: ColumnsView,
	inspector: ColumnsInspector,
	plugins: columnsPlugins,
});

const slashItem: ContentSlashItem = {
	key: "columns",
	icon: ColumnsIcon,
	label: "columns",
	keywords: ["columns", "grid", "layout", "side by side"],
	run: insertColumns,
};

/**
 * A row of one to four columns (`columns` > `column` > blocks), the email
 * block editor's `grid` with the same `desktopColumns` and
 * `mobileColumns`. Not in a preset: a host adds it where a layout belongs.
 */
export const columnsFeature = {
	...defined,
	nodes: [{ ...columnsNode, createNode: freshColumns }, columnNode] as const,
	components: { ...defined.components, [COLUMN_TYPE]: ColumnElement },
	slash: [slashItem],
	toolbar: [{ ...slashItem, group: "insert" } satisfies ContentToolbarItem],
};
