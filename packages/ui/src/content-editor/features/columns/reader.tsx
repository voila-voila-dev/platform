import type { CSSProperties } from "react";
import type {
	ContentDescendant,
	ContentNodeLike,
} from "#/content-editor/features/content-value.ts";
import { paragraphNode } from "#/content-editor/features/paragraph/reader.tsx";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import { classAttribute } from "#/content-editor/reader/escape-html.ts";
import { DEFAULT_CONTENT_EDITOR_THEME } from "#/content-editor/theme.ts";
import { cn } from "#/lib/utils.ts";

/** The names and values of the email block editor's `grid`, so a stored grid
 * converts one to one. */
export type ContentColumnsDesktopCount = 1 | 2 | 3 | 4;
export type ContentColumnsMobileCount = 1 | 2;

export const COLUMNS_DESKTOP_COUNTS: ReadonlyArray<ContentColumnsDesktopCount> =
	[1, 2, 3, 4];
export const COLUMNS_MOBILE_COUNTS: ReadonlyArray<ContentColumnsMobileCount> = [
	1, 2,
];

/** One column: leaf blocks only, never another row of columns. */
export interface ContentColumnNode extends ContentNodeLike {
	readonly type: "column";
	readonly id?: string;
}

/** A row of columns, as many as `desktopColumns`, stacked into
 * `mobileColumns` on a narrow screen. */
export interface ContentColumnsNode extends ContentNodeLike {
	readonly type: "columns";
	readonly id?: string;
	readonly desktopColumns: ContentColumnsDesktopCount;
	readonly mobileColumns: ContentColumnsMobileCount;
}

export const COLUMNS_TYPE = "columns";
export const COLUMN_TYPE = "column";

export function freshColumn(
	children: ReadonlyArray<ContentDescendant> = [paragraphNode.createNode()],
): ContentColumnNode {
	return { id: newContentNodeId(), type: COLUMN_TYPE, children };
}

export function freshColumns(
	init: {
		readonly desktopColumns?: ContentColumnsDesktopCount;
		readonly mobileColumns?: ContentColumnsMobileCount;
		readonly children?: ReadonlyArray<ContentDescendant>;
	} = {},
): ContentColumnsNode {
	const desktopColumns = init.desktopColumns ?? 2;
	return {
		id: newContentNodeId(),
		type: COLUMNS_TYPE,
		mobileColumns: 1,
		...init,
		desktopColumns,
		children:
			init.children ??
			Array.from({ length: desktopColumns }, () => freshColumn()),
	};
}

/**
 * The row's grid, shared by the canvas and the reader. The column count
 * follows the width the row is given, not the viewport's, so an email card
 * shown narrow in a side panel stacks as the phone will. 30rem sits under
 * the 600px card's content width and above a phone's.
 */
export const columnsGridClassName =
	"grid items-start grid-cols-[repeat(var(--columns-desktop),minmax(0,1fr))] @max-[30rem]:grid-cols-[repeat(var(--columns-mobile),minmax(0,1fr))]";

export function columnsGridStyle(
	node: Pick<ContentColumnsNode, "desktopColumns" | "mobileColumns">,
	gapPx: number,
) {
	return {
		"--columns-desktop": node.desktopColumns,
		"--columns-mobile": Math.min(node.mobileColumns, node.desktopColumns),
		gap: `${gapPx}px`,
	} as CSSProperties;
}

export const columnsNode: ContentNodeReader<ContentColumnsNode> = {
	type: COLUMNS_TYPE,
	createNode: freshColumns,
	markdown: {
		loss: "Columns become the blocks of each column, one after the other.",
	},
	Render: ({ node, children, options }) => (
		<div className={cn("@container", options.classNameFor?.(COLUMNS_TYPE))}>
			<div
				className={columnsGridClassName}
				style={columnsGridStyle(node, DEFAULT_CONTENT_EDITOR_THEME.gridGapPx)}
			>
				{children}
			</div>
		</div>
	),
	// A string has no container to query: the desktop grid inline, the counts
	// as data attributes a host stylesheet stacks by (see the docs).
	toHtml: (node, children, options) =>
		`<div${classAttribute(options.classNameFor?.(COLUMNS_TYPE))} data-columns="${node.desktopColumns}" data-mobile-columns="${Math.min(node.mobileColumns, node.desktopColumns)}" style="display:grid;grid-template-columns:repeat(${node.desktopColumns},minmax(0,1fr));gap:${DEFAULT_CONTENT_EDITOR_THEME.gridGapPx}px;align-items:start">${children}</div>`,
};

export const columnNode: ContentNodeReader<ContentColumnNode> = {
	type: COLUMN_TYPE,
	Render: ({ children, options }) => (
		<div className={cn("min-w-0", options.classNameFor?.(COLUMN_TYPE))}>
			{children}
		</div>
	),
	toHtml: (_node, children, options) =>
		`<div${classAttribute(options.classNameFor?.(COLUMN_TYPE))} style="min-width:0">${children}</div>`,
};

export const columnsReader = {
	key: "columns",
	nodes: [columnsNode, columnNode],
} satisfies ContentFeatureReader;
