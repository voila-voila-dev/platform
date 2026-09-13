import { ResizeHandle } from "@platejs/resizable";
import {
	TableProvider,
	useSelectedCells,
	useTableCellElement,
	useTableCellElementResizable,
	useTableColSizes,
	useTableElement,
} from "@platejs/table/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import type {
	ContentTableCellAttributes,
	ContentTableNode,
} from "#/content-editor/features/table/reader.tsx";
import { TableToolbar } from "#/content-editor/features/table/table-toolbar.tsx";
import { cn } from "#/lib/utils.ts";

function TableElementInner({ children, ...props }: PlateElementProps) {
	const { props: tableProps } = useTableElement();
	const colSizes = useTableColSizes();
	useSelectedCells();
	const node = props.element as unknown as ContentTableNode;
	return (
		<PlateElement {...props} className="py-1">
			<TableToolbar element={props.element} />
			<div className="overflow-x-auto">
				<table
					{...tableProps}
					className="w-full border-collapse text-left"
					style={{ marginLeft: 0 }}
				>
					{node.colSizes && node.colSizes.length > 0 ? (
						<colgroup contentEditable={false}>
							{colSizes.map((size, index) => (
								<col
									key={index}
									style={{ width: size > 0 ? size : undefined }}
								/>
							))}
						</colgroup>
					) : null}
					<tbody>{children}</tbody>
				</table>
			</div>
		</PlateElement>
	);
}

/** The table store (cell selection, size overrides) lives above the element. */
export function TableElement(props: PlateElementProps) {
	return (
		<TableProvider>
			<TableElementInner {...props} />
		</TableProvider>
	);
}

export function TableRowElement(props: PlateElementProps) {
	return <PlateElement {...props} as="tr" />;
}

function cellElement(header: boolean) {
	return function CellElement({ children, ...props }: PlateElementProps) {
		const { colIndex, colSpan, rowIndex, selected, width, minHeight } =
			useTableCellElement();
		const { rightProps, bottomProps, hiddenLeft, leftProps } =
			useTableCellElementResizable({ colIndex, colSpan, rowIndex });
		const cell = props.element as unknown as ContentTableCellAttributes;
		return (
			<PlateElement
				{...props}
				as={header ? "th" : "td"}
				attributes={{
					...props.attributes,
					colSpan: cell.colSpan,
					rowSpan: cell.rowSpan,
				}}
				className={cn(
					"relative border border-border px-2 py-1 align-top",
					header && "bg-muted text-left font-medium",
					selected && "bg-primary/10 ring-1 ring-primary/40 ring-inset",
				)}
				style={{
					width: typeof width === "number" && width > 0 ? width : undefined,
					minHeight,
					backgroundColor: cell.background,
				}}
			>
				<div className="relative min-h-5">{children}</div>
				<div contentEditable={false} className="select-none">
					<ResizeHandle
						{...rightProps}
						className="absolute top-0 -right-1 z-10 h-full w-2 cursor-col-resize hover:bg-primary/40"
					/>
					<ResizeHandle
						{...bottomProps}
						className="absolute bottom-[-4px] left-0 z-10 h-2 w-full cursor-row-resize hover:bg-primary/40"
					/>
					{hiddenLeft ? null : (
						<ResizeHandle
							{...leftProps}
							className="absolute top-0 -left-1 z-10 h-full w-2 cursor-col-resize hover:bg-primary/40"
						/>
					)}
				</div>
			</PlateElement>
		);
	};
}

export const TableCellElement = cellElement(false);
export const TableHeaderCellElement = cellElement(true);
