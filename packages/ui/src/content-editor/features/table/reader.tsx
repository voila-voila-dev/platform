import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
} from "#/content-editor/reader/escape-html.ts";

/** Plate's table: column widths on the table, spans and a background on a cell. */
export interface ContentTableNode extends ContentNodeLike {
	readonly type: "table";
	readonly id?: string;
	readonly colSizes?: ReadonlyArray<number>;
}
export interface ContentTableRowNode extends ContentNodeLike {
	readonly type: "tr";
}
export interface ContentTableCellAttributes {
	readonly colSpan?: number;
	readonly rowSpan?: number;
	/** A CSS colour the cell is filled with. */
	readonly background?: string;
}
export interface ContentTableCellNode
	extends ContentNodeLike,
		ContentTableCellAttributes {
	readonly type: "td";
}
export interface ContentTableHeaderCellNode
	extends ContentNodeLike,
		ContentTableCellAttributes {
	readonly type: "th";
}

function colgroupHtml(node: ContentTableNode): string {
	if (node.colSizes === undefined || node.colSizes.length === 0) {
		return "";
	}
	return `<colgroup>${node.colSizes.map((size) => `<col style="width:${size}px">`).join("")}</colgroup>`;
}

function spanAttributes(cell: ContentTableCellAttributes): string {
	return `${cell.colSpan && cell.colSpan > 1 ? ` colspan="${cell.colSpan}"` : ""}${cell.rowSpan && cell.rowSpan > 1 ? ` rowspan="${cell.rowSpan}"` : ""}${cell.background ? ` style="background-color:${escapeHtml(cell.background)}"` : ""}`;
}

export const tableNode: ContentInsertableNodeReader<ContentTableNode> = {
	type: "table",
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "table",
		children: [],
		...init,
	}),
	Render: ({ node, children, options }) => (
		<div className="overflow-x-auto">
			<table
				id={options.idFor?.(node) ?? node.id}
				className={
					options.classNameFor?.("table") ?? "w-full border-collapse text-left"
				}
			>
				{node.colSizes && node.colSizes.length > 0 ? (
					<colgroup>
						{node.colSizes.map((size, index) => (
							<col key={index} style={{ width: size }} />
						))}
					</colgroup>
				) : null}
				<tbody>{children}</tbody>
			</table>
		</div>
	),
	toHtml: (node, children, options) =>
		`<table${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("table"))}>${colgroupHtml(node)}<tbody>${children}</tbody></table>`,
};

export const tableRowNode: ContentNodeReader<ContentTableRowNode> = {
	type: "tr",
	Render: ({ children }) => <tr>{children}</tr>,
	toHtml: (_node, children) => `<tr>${children}</tr>`,
};

export const tableCellNode: ContentNodeReader<ContentTableCellNode> = {
	type: "td",
	Render: ({ node, children, options }) => (
		<td
			colSpan={node.colSpan}
			rowSpan={node.rowSpan}
			style={node.background ? { backgroundColor: node.background } : undefined}
			className={
				options.classNameFor?.("td") ??
				"border border-border px-2 py-1 align-top"
			}
		>
			{children}
		</td>
	),
	toHtml: (node, children, options) =>
		`<td${spanAttributes(node)}${classAttribute(options.classNameFor?.("td"))}>${children}</td>`,
};

export const tableHeaderCellNode: ContentNodeReader<ContentTableHeaderCellNode> =
	{
		type: "th",
		Render: ({ node, children, options }) => (
			<th
				colSpan={node.colSpan}
				rowSpan={node.rowSpan}
				style={
					node.background ? { backgroundColor: node.background } : undefined
				}
				className={
					options.classNameFor?.("th") ??
					"border border-border bg-muted px-2 py-1 text-left font-medium"
				}
			>
				{children}
			</th>
		),
		toHtml: (node, children, options) =>
			`<th${spanAttributes(node)}${classAttribute(options.classNameFor?.("th"))}>${children}</th>`,
	};

export const tableReader = {
	key: "table",
	nodes: [tableNode, tableRowNode, tableCellNode, tableHeaderCellNode],
} satisfies ContentFeatureReader;
