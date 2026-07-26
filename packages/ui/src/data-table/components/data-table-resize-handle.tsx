import type {
	ColumnSizingState,
	Header,
	Table as TanstackTable,
} from "@tanstack/react-table";
import { cn } from "#/lib/utils.ts";

interface Props<TData> {
	header: Header<TData, unknown>;
	table: TanstackTable<TData>;
}

/**
 * The drag target that resizes a column. Sits on the header's trailing edge and
 * is also focusable, so the width is reachable without a pointer.
 */
export function DataTableResizeHandle<TData>({ header, table }: Props<TData>) {
	const nudge = (delta: number) => {
		const next = Math.max(40, header.getSize() + delta);
		table.setColumnSizing((previous: ColumnSizingState) => ({
			...previous,
			[header.column.id]: next,
		}));
	};
	return (
		<button
			type="button"
			data-slot="data-table-resize-handle"
			aria-label={`Resize column`}
			// The button is a wide, invisible hit area straddling the column
			// boundary; the visible 2px rule is a child so the target can be
			// comfortable without drawing a fat line.
			className={cn(
				"group/resize absolute inset-y-0 right-0 z-20 flex w-3 translate-x-1/2",
				"cursor-col-resize touch-none select-none items-stretch justify-center",
				"bg-transparent focus-visible:outline-none",
			)}
			onMouseDown={header.getResizeHandler()}
			onTouchStart={header.getResizeHandler()}
			// A resize handle inside a sortable header must not also sort.
			onClick={(event) => event.stopPropagation()}
			onKeyDown={(event) => {
				if (event.key === "ArrowLeft") {
					event.preventDefault();
					nudge(-16);
				}
				if (event.key === "ArrowRight") {
					event.preventDefault();
					nudge(16);
				}
			}}
		>
			<span
				aria-hidden="true"
				className={cn(
					"w-0.5 rounded-full transition-colors",
					"group-hover/resize:bg-border group-focus-visible/resize:bg-ring",
					header.column.getIsResizing() ? "bg-ring" : "bg-transparent",
				)}
			/>
		</button>
	);
}
