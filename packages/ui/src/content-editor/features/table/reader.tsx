import { Children, type ReactNode } from "react";
import {
	type ContentDescendant,
	type ContentNodeLike,
	isContentText,
} from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { variablePlaceholder } from "#/content-editor/features/variable/reader.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	classAttribute,
	escapeHtml,
	idAttribute,
	kitClassName,
} from "#/content-editor/reader/escape-html.ts";

export type ContentTableColumnAlign = "left" | "right";

/** A column of an email table: how its cells line up. */
export interface ContentTableColumn {
	readonly align: ContentTableColumnAlign;
}

/**
 * Plate's table: column widths on the table, spans and a background on a
 * cell. An email table (`emailTableFeature`) carries `columns` and
 * `headerRow` instead, the email block editor's table attributes, and its
 * cells hold plain text only.
 */
export interface ContentTableNode extends ContentNodeLike {
	readonly type: "table";
	readonly id?: string;
	readonly colSizes?: ReadonlyArray<number>;
	/** One per column, in order. Present on an email table only. */
	readonly columns?: ReadonlyArray<ContentTableColumn>;
	/** The first row is the column titles. Present on an email table only. */
	readonly headerRow?: boolean;
}

/** An email table: the attributes the email mode writes. */
export function isEmailTable(
	node: ContentTableNode,
): node is ContentTableNode & {
	readonly columns: ReadonlyArray<ContentTableColumn>;
} {
	return Array.isArray(node.columns);
}

/** The plain text of a node, its blocks joined by a space. */
export function plainText(node: ContentDescendant): string {
	if (isContentText(node)) {
		return node.text;
	}
	if (node.type === "variable" && typeof node.name === "string") {
		return variablePlaceholder(node.name);
	}
	const inline = node.children.every(
		(child) => isContentText(child) || child.type === "a",
	);
	return node.children.map(plainText).join(inline ? "" : " ");
}

/** An email table's cells as text, row by row: what the email renders. */
export function emailTableRows(
	node: ContentTableNode,
): ReadonlyArray<ReadonlyArray<string>> {
	return node.children.map((row) =>
		isContentText(row) ? [] : row.children.map(plainText),
	);
}

/** The flush-edge padding of `emailLineItemsTable`. */
function emailCellStyle(
	column: number,
	columns: number,
	align: ContentTableColumnAlign,
	header: boolean,
): string {
	return `text-align:${align};padding:8px ${column === columns - 1 ? 0 : 10}px 8px ${column === 0 ? 0 : 10}px;border-bottom:${header ? 2 : 1}px solid var(--color-border, #e5e7eb)`;
}

function emailTableHtml(
	node: ContentTableNode & {
		readonly columns: ReadonlyArray<ContentTableColumn>;
	},
	options: { readonly id?: string; readonly className?: string },
): string {
	const rows = emailTableRows(node);
	const width = node.columns.length;
	const row = (cells: ReadonlyArray<string>, header: boolean) =>
		`<tr>${Array.from({ length: width }, (_, column) => {
			const tag = header ? "th" : "td";
			return `<${tag} style="${emailCellStyle(column, width, node.columns[column]?.align ?? "left", header)}">${escapeHtml(cells[column] ?? "")}</${tag}>`;
		}).join("")}</tr>`;
	const [first = [], ...rest] = rows;
	const head =
		node.headerRow === true ? `<thead>${row(first, true)}</thead>` : "";
	const body = (node.headerRow === true ? rest : rows)
		.map((cells) => row(cells, false))
		.join("");
	return `<table${idAttribute(options.id)}${classAttribute(options.className)} style="width:100%;border-collapse:collapse">${head}<tbody>${body}</tbody></table>`;
}

function EmailTable({
	node,
	id,
	className,
}: {
	readonly node: ContentTableNode & {
		readonly columns: ReadonlyArray<ContentTableColumn>;
	};
	readonly id?: string;
	readonly className?: string;
}) {
	const rows = emailTableRows(node);
	const width = node.columns.length;
	const cells = (values: ReadonlyArray<string>, header: boolean) =>
		Array.from({ length: width }, (_, column) => {
			const Tag = header ? "th" : "td";
			return (
				<Tag
					key={column}
					className={
						header
							? "font-semibold text-muted-foreground text-xs uppercase"
							: undefined
					}
					style={{
						textAlign: node.columns[column]?.align ?? "left",
						padding: `8px ${column === width - 1 ? 0 : 10}px 8px ${column === 0 ? 0 : 10}px`,
						borderBottom: `${header ? 2 : 1}px solid var(--color-border)`,
					}}
				>
					{values[column] ?? ""}
				</Tag>
			);
		});
	const [first = [], ...rest] = rows;
	return (
		<table id={id} className={className ?? "w-full border-collapse"}>
			{node.headerRow === true ? (
				<thead>
					<tr>{cells(first, true)}</tr>
				</thead>
			) : null}
			<tbody>
				{(node.headerRow === true ? rest : rows).map((values, index) => (
					<tr key={index}>{cells(values, false)}</tr>
				))}
			</tbody>
		</table>
	);
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

/** The first row is the table's head when every cell of it is a header cell. */
function hasHeadRow(node: ContentTableNode): boolean {
	const [first] = node.children;
	return (
		first !== undefined &&
		!isContentText(first) &&
		first.children.length > 0 &&
		first.children.every((cell) => !isContentText(cell) && cell.type === "th")
	);
}

function TableRows({
	node,
	children,
}: {
	readonly node: ContentTableNode;
	readonly children: ReactNode;
}) {
	const rows = Children.toArray(children);
	if (!hasHeadRow(node)) {
		return <tbody>{rows}</tbody>;
	}
	const [head, ...body] = rows;
	return (
		<>
			<thead>{head}</thead>
			{body.length > 0 ? <tbody>{body}</tbody> : null}
		</>
	);
}

function tableRowsHtml(
	node: ContentTableNode,
	rows: ReadonlyArray<string>,
): string {
	if (!hasHeadRow(node)) {
		return `<tbody>${rows.join("")}</tbody>`;
	}
	const [head, ...body] = rows;
	return `<thead>${head}</thead>${body.length > 0 ? `<tbody>${body.join("")}</tbody>` : ""}`;
}

export const tableNode: ContentInsertableNodeReader<ContentTableNode> = {
	type: "table",
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "table",
		children: [],
		...init,
	}),
	Render: ({ node, children, options }) =>
		isEmailTable(node) ? (
			<EmailTable
				node={node}
				id={options.idFor?.(node) ?? node.id}
				className={options.classNameFor?.("table")}
			/>
		) : (
			<div className="overflow-x-auto">
				<table
					id={options.idFor?.(node) ?? node.id}
					className={kitClassName(
						options,
						"table",
						"w-full border-collapse text-left",
					)}
				>
					{node.colSizes && node.colSizes.length > 0 ? (
						<colgroup>
							{node.colSizes.map((size, index) => (
								<col key={index} style={{ width: size }} />
							))}
						</colgroup>
					) : null}
					<TableRows node={node}>{children}</TableRows>
				</table>
			</div>
		),
	toHtml: (node, _children, options, rows) =>
		isEmailTable(node)
			? emailTableHtml(node, {
					id: options.idFor?.(node) ?? node.id,
					className: options.classNameFor?.("table"),
				})
			: `<table${idAttribute(options.idFor?.(node) ?? node.id)}${classAttribute(options.classNameFor?.("table"))}>${colgroupHtml(node)}${tableRowsHtml(node, rows)}</table>`,
};

export const tableRowNode: ContentNodeReader<ContentTableRowNode> = {
	type: "tr",
	Render: ({ children }) => <tr>{children}</tr>,
	toHtml: (_node, _children, _options, cells) => `<tr>${cells.join("")}</tr>`,
};

export const tableCellNode: ContentNodeReader<ContentTableCellNode> = {
	type: "td",
	unwrapLoneParagraph: true,
	Render: ({ node, children, options }) => (
		<td
			colSpan={node.colSpan}
			rowSpan={node.rowSpan}
			style={node.background ? { backgroundColor: node.background } : undefined}
			className={kitClassName(
				options,
				"td",
				"border border-border px-2 py-1 align-top",
			)}
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
		unwrapLoneParagraph: true,
		Render: ({ node, children, options }) => (
			<th
				colSpan={node.colSpan}
				rowSpan={node.rowSpan}
				style={
					node.background ? { backgroundColor: node.background } : undefined
				}
				className={kitClassName(
					options,
					"th",
					"border border-border bg-muted px-2 py-1 text-left font-medium",
				)}
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
