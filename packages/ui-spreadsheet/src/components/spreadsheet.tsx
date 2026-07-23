import {
	CaretDownIcon,
	CaretUpDownIcon,
	CaretUpIcon,
	DotsSixVerticalIcon,
	ImageIcon,
	PlusIcon,
	SpinnerIcon,
	XIcon,
} from "@phosphor-icons/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Skeleton } from "@voila.dev/ui/components/skeleton";
import { cva } from "@voila.dev/ui/cva";
import { useIsMobile } from "@voila.dev/ui/hooks/use-mobile";
import { cn } from "@voila.dev/ui/lib/utils";
import * as React from "react";
import {
	type SpreadsheetDropLine,
	useSpreadsheetColumnReorder,
	useSpreadsheetColumnResize,
	useSpreadsheetRowDrag,
} from "#/hooks/use-spreadsheet-drag.ts";
import {
	type SpreadsheetPasteData,
	useSpreadsheetGrid,
} from "#/hooks/use-spreadsheet-grid.ts";
import { useSpreadsheetImageDrop } from "#/hooks/use-spreadsheet-image-drop.ts";

type SpreadsheetSortDirection = "asc" | "desc";

interface SpreadsheetSort {
	columnId: string;
	direction: SpreadsheetSortDirection;
}

interface SpreadsheetContextValue {
	stickyHeader: boolean;
	sort: SpreadsheetSort | null;
	onSortChange: ((sort: SpreadsheetSort | null) => void) | undefined;
	columnSizing: Record<string, number>;
	resizeColumn: (columnId: string, width: number) => void;
	columnOrder: readonly string[] | undefined;
	onColumnOrderChange: ((order: string[]) => void) | undefined;
	onRowMove: ((fromIndex: number, toIndex: number) => void) | undefined;
	setDropLine: (line: SpreadsheetDropLine | null) => void;
	announce: (message: string) => void;
	gridNavigation: boolean;
	/**
	 * The scroll container as STATE (callback ref), not a ref object: it lands
	 * after the initial commit, and the state change re-renders
	 * `SpreadsheetVirtualRows` so the virtualizer sees its scroll element -
	 * a plain ref would stay null in its first layout effect (descendant
	 * effects run before parent refs attach) with no re-render to recover.
	 */
	scrollContainer: HTMLDivElement | null;
	setVirtualRowCount: (count: number | null) => void;
}

const SpreadsheetContext = React.createContext<SpreadsheetContextValue>({
	stickyHeader: false,
	sort: null,
	onSortChange: undefined,
	columnSizing: {},
	resizeColumn: () => {},
	columnOrder: undefined,
	onColumnOrderChange: undefined,
	onRowMove: undefined,
	setDropLine: () => {},
	announce: () => {},
	gridNavigation: false,
	scrollContainer: null,
	setVirtualRowCount: () => {},
});

/**
 * Absolute row index injected by `SpreadsheetVirtualRows` so each mounted
 * `SpreadsheetRow` can stamp `data-index`/`aria-rowindex` itself - grid
 * navigation and screen readers keep working over the unmounted rows.
 */
const SpreadsheetRowIndexContext = React.createContext<number | null>(null);

// Grid-mode visuals: the focused cell's ring (plain `:focus` - a
// click-selected cell must show it too) and the selection range (tint on
// every selected cell, one outer border drawn by the per-edge ::after
// segments stamped by the grid hook).
const gridNavigationTableClassName = cn(
	"[&_td:focus]:outline-none [&_td:focus]:inset-ring-2 [&_td:focus]:inset-ring-ring/70",
	"[&_td[data-grid-selected]]:bg-primary/10",
	"[&_td[data-grid-selected]]:after:pointer-events-none [&_td[data-grid-selected]]:after:absolute [&_td[data-grid-selected]]:after:inset-0 [&_td[data-grid-selected]]:after:content-[''] [&_td[data-grid-selected]]:after:border-primary/60",
	"[&_td[data-grid-edge-top]]:after:border-t-2 [&_td[data-grid-edge-bottom]]:after:border-b-2 [&_td[data-grid-edge-left]]:after:border-l-2 [&_td[data-grid-edge-right]]:after:border-r-2",
);

// Sticky first column: every row's first CELL PART pins to the left edge
// while the other columns pan beneath it. Targeting `td[data-slot]` (the cell
// parts all stamp one) skips the full-width rows - add-row, virtual spacers -
// where pinning would only paint a stray edge line. Collapsed borders don't
// travel with sticky cells (the sticky-header trap again), so the right rule
// is redrawn as an inset shadow; the backgrounds must be opaque - color-mix
// flattens the kit's translucent tints (header muted, invalid destructive,
// selection primary) over the page background - or the panned columns would
// show through. Once the container actually pans (`data-scrolled-x`, stamped
// by a scroll listener), an elevation shadow marks the cut edge.
const stickyFirstColumnTableClassName = cn(
	"[&_thead_th:first-child]:sticky [&_thead_th:first-child]:left-0 [&_thead_th:first-child]:z-2",
	"[&_thead_th:first-child]:border-r-0 [&_thead_th:first-child]:bg-[color-mix(in_oklab,var(--color-muted)_50%,var(--color-background))]",
	"[&_thead_th:first-child]:shadow-[inset_-1px_0_var(--color-border)]",
	"[&_tbody_td[data-slot]:first-child]:sticky [&_tbody_td[data-slot]:first-child]:left-0 [&_tbody_td[data-slot]:first-child]:z-2",
	"[&_tbody_td[data-slot]:first-child]:border-r-0 [&_tbody_td[data-slot]:first-child]:bg-background",
	"[&_tbody_td[data-slot]:first-child]:shadow-[inset_-1px_0_var(--color-border)]",
	"[&_tbody_tr[data-invalid]_td[data-slot]:first-child]:bg-[color-mix(in_oklab,var(--color-destructive)_5%,var(--color-background))]",
	"[&_tbody_td[data-slot][data-grid-selected]:first-child]:bg-[color-mix(in_oklab,var(--color-primary)_10%,var(--color-background))]",
	"[[data-scrolled-x]_&_thead_th:first-child]:shadow-[inset_-1px_0_var(--color-border),6px_0_8px_-6px_rgb(0_0_0/0.25)]",
	"[[data-scrolled-x]_&_tbody_td[data-slot]:first-child]:shadow-[inset_-1px_0_var(--color-border),6px_0_8px_-6px_rgb(0_0_0/0.25)]",
);

/**
 * Stamps `data-scrolled-x` on the scroll container while it is panned - it
 * gates the sticky column's elevation shadow. Written outside React so
 * panning never re-renders the table.
 */
function useSpreadsheetScrolledX(
	scrollContainer: HTMLDivElement | null,
	enabled: boolean,
) {
	React.useEffect(() => {
		if (!enabled || scrollContainer === null) {
			return;
		}
		const update = () => {
			scrollContainer.toggleAttribute(
				"data-scrolled-x",
				scrollContainer.scrollLeft > 0,
			);
		};
		update();
		scrollContainer.addEventListener("scroll", update, { passive: true });
		return () => {
			scrollContainer.removeEventListener("scroll", update);
			scrollContainer.removeAttribute("data-scrolled-x");
		};
	}, [enabled, scrollContainer]);
}

function editableTableClassName({
	hasFixedSizing,
	gridNavigation,
	stickyFirstColumn,
	stickyHeader,
	className,
}: {
	hasFixedSizing: boolean;
	gridNavigation: boolean;
	stickyFirstColumn: boolean;
	stickyHeader: boolean;
	className: string | undefined;
}) {
	return cn(
		"w-full caption-bottom text-sm",
		hasFixedSizing && "table-fixed",
		gridNavigation && gridNavigationTableClassName,
		stickyFirstColumn && stickyFirstColumnTableClassName,
		// A sticky header goes opaque (see SpreadsheetHeader); its pinned
		// corner cell must follow.
		stickyFirstColumn &&
			stickyHeader &&
			"[&_thead_th:first-child]:bg-background",
		className,
	);
}

/**
 * Assembles the memoized context value shared with every part, including the
 * `resizeColumn` writer (internal state unless `columnSizing` is controlled).
 */
function useSpreadsheetContextValue({
	stickyHeader,
	sort,
	onSortChange,
	sizing,
	columnSizing,
	onColumnSizingChange,
	setInternalSizing,
	columnOrder,
	onColumnOrderChange,
	onRowMove,
	setDropLine,
	announce,
	gridNavigation,
	scrollContainer,
	setVirtualRowCount,
}: Omit<SpreadsheetContextValue, "columnSizing" | "resizeColumn"> & {
	sizing: Record<string, number>;
	columnSizing: Record<string, number> | undefined;
	onColumnSizingChange: ((sizing: Record<string, number>) => void) | undefined;
	setInternalSizing: (sizing: Record<string, number>) => void;
}) {
	return React.useMemo<SpreadsheetContextValue>(
		() => ({
			stickyHeader,
			sort,
			onSortChange,
			columnSizing: sizing,
			resizeColumn: (columnId, width) => {
				const next = { ...sizing, [columnId]: Math.round(width) };
				if (columnSizing === undefined) {
					setInternalSizing(next);
				}
				onColumnSizingChange?.(next);
			},
			columnOrder,
			onColumnOrderChange,
			onRowMove,
			setDropLine,
			announce,
			gridNavigation,
			scrollContainer,
			setVirtualRowCount,
		}),
		[
			stickyHeader,
			sort,
			onSortChange,
			sizing,
			columnSizing,
			onColumnSizingChange,
			setInternalSizing,
			columnOrder,
			onColumnOrderChange,
			onRowMove,
			setDropLine,
			announce,
			gridNavigation,
			scrollContainer,
			setVirtualRowCount,
		],
	);
}

/** Insertion indicator for column/row drags, drawn over the container. */
function SpreadsheetDropLineIndicator({
	dropLine,
}: {
	dropLine: SpreadsheetDropLine | null;
}) {
	if (dropLine === null) {
		return null;
	}
	return (
		<div
			aria-hidden="true"
			data-slot="spreadsheet-drop-line"
			className="pointer-events-none absolute z-20 rounded-full bg-primary"
			style={dropLine}
		/>
	);
}

/** The scroll container + table + drag overlays of the desktop rendering. */
function SpreadsheetDesktopTable({
	contextValue,
	setScrollContainer,
	stickyHeader,
	containerClassName,
	tableClassName,
	ariaRowCount,
	dropLine,
	announcement,
	grid,
	tableProps,
}: {
	contextValue: SpreadsheetContextValue;
	setScrollContainer: (element: HTMLDivElement | null) => void;
	stickyHeader: boolean;
	containerClassName: string | undefined;
	tableClassName: string;
	ariaRowCount: number | undefined;
	dropLine: SpreadsheetDropLine | null;
	announcement: string;
	grid: ReturnType<typeof useSpreadsheetGrid>;
	tableProps: React.ComponentProps<"table">;
}) {
	return (
		<SpreadsheetContext.Provider value={contextValue}>
			<div
				ref={setScrollContainer}
				data-slot="spreadsheet-container"
				className={cn(
					"relative w-full overflow-x-auto rounded-lg border border-input",
					stickyHeader && "overflow-y-auto",
					containerClassName,
				)}
			>
				<table
					data-slot="spreadsheet"
					aria-rowcount={ariaRowCount}
					className={tableClassName}
					{...tableProps}
					{...grid.tableProps}
					ref={grid.tableRef}
				/>
				<SpreadsheetDropLineIndicator dropLine={dropLine} />
			</div>
			{/* Drag interactions announce their keyboard steps here. */}
			<div role="status" aria-live="polite" className="sr-only">
				{announcement}
			</div>
		</SpreadsheetContext.Provider>
	);
}

/** The below-`md` replacement for the table: one card per row. */
function SpreadsheetMobileList({
	rowCount,
	renderMobileRow,
	mobileAddRow,
}: {
	rowCount: number | undefined;
	renderMobileRow: (index: number) => React.ReactNode;
	mobileAddRow: React.ReactNode;
}) {
	return (
		<div data-slot="spreadsheet-mobile-list" className="flex flex-col gap-3">
			{rowCount !== undefined && rowCount > 0 ? (
				<ul className="flex flex-col gap-2">
					{Array.from({ length: rowCount }, (_, index) => (
						<li
							// Index keys are safe here: the card fields are controlled by
							// the consumer's row state, never by DOM state.
							key={index}
							data-slot="spreadsheet-mobile-card"
							className="rounded-lg border border-input bg-card p-3"
						>
							{renderMobileRow(index)}
						</li>
					))}
				</ul>
			) : null}
			{mobileAddRow}
		</div>
	);
}

type SpreadsheetRootProps = React.ComponentProps<"table"> & {
	containerClassName?: string;
	/**
	 * Pins the header row while the body scrolls. Only useful together with a
	 * `max-h-*` on the container (via `containerClassName`).
	 */
	stickyHeader?: boolean;
	/**
	 * Pins each row's first cell while the table pans horizontally, keeping the
	 * row label readable on narrow screens; an edge shadow appears once the
	 * container is actually scrolled. Render a read-only part
	 * (`SpreadsheetCellText`) as the first column - a panning grid under a
	 * pinned editable cell is disorienting.
	 */
	stickyFirstColumn?: boolean;
	/**
	 * Controlled sort state for `sortable` header cells. The table never sorts
	 * the rows itself: reorder your row array when this changes (a sorted view
	 * over indexed form rows would break their binding).
	 */
	sort?: SpreadsheetSort | null;
	onSortChange?: (sort: SpreadsheetSort | null) => void;
	/**
	 * Column widths by `columnId`, written by `resizable` header cells. Leave
	 * undefined for internal state; pass it (with `onColumnSizingChange`) to
	 * control or persist the widths. Any entry switches the table to
	 * `table-layout: fixed`.
	 */
	columnSizing?: Record<string, number>;
	onColumnSizingChange?: (sizing: Record<string, number>) => void;
	/**
	 * Controlled column order, as the list of `columnId`s currently rendered.
	 * Providing it (with `onColumnOrderChange`) makes identified header cells
	 * draggable and Alt+arrow movable; the consumer re-renders columns, header
	 * and body cells alike, in the received order.
	 */
	columnOrder?: string[];
	onColumnOrderChange?: (order: string[]) => void;
	/**
	 * Enables `SpreadsheetDragHandle` cells: called with the dragged row's
	 * index and its target position. Apply the move to your row array.
	 */
	onRowMove?: (fromIndex: number, toIndex: number) => void;
	/**
	 * Opt-in spreadsheet keyboard layer, upgrading the table to `role="grid"`:
	 * the body cells become a single roving tab stop (arrows/Home/End/PageUp/
	 * PageDown move, Enter/F2/typing edits, Escape comes back), Shift+arrows or
	 * pointer drag select a rectangle and Cmd/Ctrl+C copies it as TSV (the
	 * `value` prop on `SpreadsheetCell` overrides what's copied). Off by
	 * default: the phase-1 native Tab order stays the baseline.
	 */
	gridNavigation?: boolean;
	/**
	 * Grid-mode paste (Cmd/Ctrl+V on a cell in navigation mode): receives the
	 * parsed TSV matrix and the target's top-left position. The table never
	 * mutates anything - apply the values to your row array, extending it when
	 * the paste overflows (multi-row pastes from Excel/Sheets are the target
	 * use case).
	 */
	onPasteData?: (data: SpreadsheetPasteData) => void;
	/** Total number of rows - only read by the mobile card mode. */
	rowCount?: number;
	/**
	 * Card content for one row below the `md` breakpoint. When provided (with
	 * `rowCount`), the table is replaced on mobile by a vertical stack of
	 * cards - a dense grid is not editable with a thumb. Render the SAME
	 * controlled fields in a labelled vertical layout (`Field` + regular
	 * controls, not flattened) plus the row's delete button; `mobileAddRow`
	 * takes over from `SpreadsheetAddRow` under the stack.
	 */
	renderMobileRow?: (index: number) => React.ReactNode;
	/**
	 * Rendered full-width under the mobile card stack - put an
	 * `SpreadsheetMobileAddRow` here, wired like your `SpreadsheetAddRow`.
	 */
	mobileAddRow?: React.ReactNode;
};

/**
 * Spreadsheet-style editable grid: rows of kit form controls (`Input`,
 * `MoneyInput`, `NativeSelect`, `Checkbox`, `Switch`) rendered flush inside
 * dense cells, with the focus/invalid ring drawn on the cell instead of the
 * control. Purely presentational - the consumer owns the row state (an array
 * field, effect-form rows, plain `useState`) and wires each control's
 * controlled contract. Column headers don't label the controls for screen
 * readers: give every control and action button its own `aria-label`.
 * `gridNavigation` layers spreadsheet keyboard semantics (roving cells,
 * range selection, TSV copy/paste) on top - see the prop's doc.
 */
function SpreadsheetRoot({
	rowCount,
	renderMobileRow,
	mobileAddRow,
	...props
}: SpreadsheetRootProps) {
	const isMobile = useIsMobile();
	if (isMobile && renderMobileRow !== undefined) {
		return (
			<SpreadsheetMobileList
				rowCount={rowCount}
				renderMobileRow={renderMobileRow}
				mobileAddRow={mobileAddRow}
			/>
		);
	}
	return <SpreadsheetDesktop {...props} />;
}

/** Hooks, context and class assembly behind the desktop rendering. */
function SpreadsheetDesktop({
	className,
	containerClassName,
	stickyHeader = false,
	stickyFirstColumn = false,
	sort = null,
	onSortChange,
	columnSizing,
	onColumnSizingChange,
	columnOrder,
	onColumnOrderChange,
	onRowMove,
	gridNavigation = false,
	onPasteData,
	...props
}: Omit<
	SpreadsheetRootProps,
	"rowCount" | "renderMobileRow" | "mobileAddRow"
>) {
	const [internalSizing, setInternalSizing] = React.useState<
		Record<string, number>
	>({});
	const [dropLine, setDropLine] = React.useState<SpreadsheetDropLine | null>(
		null,
	);
	const [announcement, setAnnouncement] = React.useState("");
	const [virtualRowCount, setVirtualRowCount] = React.useState<number | null>(
		null,
	);
	const [scrollContainer, setScrollContainer] =
		React.useState<HTMLDivElement | null>(null);
	const sizing = columnSizing ?? internalSizing;
	const grid = useSpreadsheetGrid({
		enabled: gridNavigation,
		onPasteData,
		virtualRowCount,
	});
	useSpreadsheetScrolledX(scrollContainer, stickyFirstColumn);
	const contextValue = useSpreadsheetContextValue({
		stickyHeader,
		sort,
		onSortChange,
		sizing,
		columnSizing,
		onColumnSizingChange,
		setInternalSizing,
		columnOrder,
		onColumnOrderChange,
		onRowMove,
		setDropLine,
		announce: setAnnouncement,
		gridNavigation,
		scrollContainer,
		setVirtualRowCount,
	});
	return (
		<SpreadsheetDesktopTable
			contextValue={contextValue}
			setScrollContainer={setScrollContainer}
			stickyHeader={stickyHeader}
			containerClassName={containerClassName}
			tableClassName={editableTableClassName({
				hasFixedSizing: Object.keys(sizing).length > 0,
				gridNavigation,
				stickyFirstColumn,
				stickyHeader,
				className,
			})}
			// One header row assumed - grid navigation restamps the exact count
			// when enabled.
			ariaRowCount={virtualRowCount === null ? undefined : virtualRowCount + 1}
			dropLine={dropLine}
			announcement={announcement}
			grid={grid}
			tableProps={props}
		/>
	);
}

function SpreadsheetColumns(props: React.ComponentProps<"colgroup">) {
	return <colgroup data-slot="spreadsheet-columns" {...props} />;
}

/**
 * Column widths live on `<col>` elements (not header classes) so column
 * resizing and `table-layout: fixed` have a single place to write to. A
 * resized width (matched by `columnId`) overrides the `width` prop.
 */
function SpreadsheetColumn({
	columnId,
	width,
	style,
	...props
}: React.ComponentProps<"col"> & {
	/** Matches the `columnId` of the header cell that resizes this column. */
	columnId?: string;
	width?: number | string;
}) {
	const { columnSizing } = React.useContext(SpreadsheetContext);
	const sizedWidth =
		columnId === undefined ? undefined : columnSizing[columnId];
	const finalWidth = sizedWidth ?? width;
	return (
		<col
			data-slot="spreadsheet-column"
			style={finalWidth === undefined ? style : { ...style, width: finalWidth }}
			{...props}
		/>
	);
}

function SpreadsheetHeader({
	className,
	...props
}: React.ComponentProps<"thead">) {
	const { stickyHeader } = React.useContext(SpreadsheetContext);
	return (
		<thead
			data-slot="spreadsheet-header"
			className={cn(
				"bg-muted/50",
				// Collapsed borders don't travel with a sticky thead, so the bottom
				// rule is redrawn as an inset shadow and the header cells drop their
				// own border-b. The translucent tint also goes opaque: scrolled rows
				// would show through `bg-muted/50`.
				stickyHeader &&
					"sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)] [&_th]:border-b-0",
				className,
			)}
			{...props}
		/>
	);
}

const ARIA_SORT_BY_DIRECTION: Record<
	SpreadsheetSortDirection,
	"ascending" | "descending"
> = {
	asc: "ascending",
	desc: "descending",
};

function SpreadsheetSortCaret({
	direction,
}: {
	direction: SpreadsheetSortDirection | undefined;
}) {
	if (direction === "asc") {
		return <CaretUpIcon className="size-3.5 shrink-0" />;
	}
	if (direction === "desc") {
		return <CaretDownIcon className="size-3.5 shrink-0" />;
	}
	return (
		<CaretUpDownIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
	);
}

/**
 * Focusable 8px strip on the header cell's right edge. Pointer drag or
 * ArrowLeft/ArrowRight (16px steps) resize the column, writing through the
 * table's `columnSizing`.
 */
function SpreadsheetResizeHandle({ columnId }: { columnId: string }) {
	const { columnSizing, resizeColumn } = React.useContext(SpreadsheetContext);
	const handleProps = useSpreadsheetColumnResize({
		width: columnSizing[columnId],
		onWidthChange: (width) => resizeColumn(columnId, width),
	});
	return (
		<div
			data-slot="spreadsheet-resize-handle"
			role="separator"
			aria-orientation="vertical"
			aria-label="Resize column"
			tabIndex={0}
			className="absolute top-0 right-0 z-10 h-full w-2 cursor-col-resize touch-none outline-none select-none after:absolute after:top-1/2 after:right-px after:h-4 after:w-0.5 after:-translate-y-1/2 after:rounded-full after:bg-transparent hover:after:bg-ring focus-visible:after:bg-ring"
			{...handleProps}
		/>
	);
}

/**
 * `sortable` turns the header into a tri-state sort button (needs `columnId`
 * plus `sort`/`onSortChange` on the table); `resizable` adds a resize handle
 * on the right edge. When the table has a controlled `columnOrder`, any
 * identified header cell also becomes draggable, with Alt+ArrowLeft/Right as
 * the keyboard alternative (a `sortable` head stays pointer-draggable only
 * through that keyboard path: its surface is the sort button).
 */
function SpreadsheetHead({
	className,
	columnId,
	sortable = false,
	resizable = false,
	children,
	...props
}: React.ComponentProps<"th"> & {
	/** Stable column identifier for sorting/resizing/reordering. */
	columnId?: string;
	sortable?: boolean;
	resizable?: boolean;
}) {
	const context = React.useContext(SpreadsheetContext);
	const reorder = useSpreadsheetColumnReorder({
		columnId,
		columnOrder: context.columnOrder,
		onColumnOrderChange: context.onColumnOrderChange,
		setDropLine: context.setDropLine,
		announce: context.announce,
	});
	const canSort = sortable && columnId !== undefined;
	const sortDirection =
		canSort && context.sort?.columnId === columnId
			? context.sort.direction
			: undefined;
	return (
		<th
			scope="col"
			data-slot="spreadsheet-head"
			data-column-id={columnId}
			aria-sort={
				sortDirection === undefined
					? undefined
					: ARIA_SORT_BY_DIRECTION[sortDirection]
			}
			tabIndex={reorder.enabled ? 0 : undefined}
			className={cn(
				"h-8 border-r border-b border-input px-2.5 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground last:border-r-0",
				canSort && "p-0",
				resizable && "relative",
				reorder.enabled &&
					"cursor-grab touch-none outline-none select-none focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70",
				className,
			)}
			{...props}
			{...reorder.headProps}
		>
			{canSort ? (
				<button
					type="button"
					className="flex h-8 w-full items-center gap-1 px-2.5 text-left outline-none hover:bg-muted/50 hover:text-foreground focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70"
					onClick={() => {
						if (context.onSortChange === undefined) {
							return;
						}
						context.onSortChange(
							sortDirection === undefined
								? { columnId, direction: "asc" }
								: sortDirection === "asc"
									? { columnId, direction: "desc" }
									: null,
						);
					}}
				>
					<span className="truncate">{children}</span>
					<SpreadsheetSortCaret direction={sortDirection} />
				</button>
			) : (
				children
			)}
			{resizable && columnId !== undefined ? (
				<SpreadsheetResizeHandle columnId={columnId} />
			) : null}
		</th>
	);
}

function SpreadsheetBody({
	className,
	...props
}: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot="spreadsheet-body"
			className={cn("[&_tr:last-child>td]:border-b-0", className)}
			{...props}
		/>
	);
}

/**
 * No hover background on purpose: the controls sit on transparent
 * backgrounds, so a row tint would bleed into every field.
 */
function SpreadsheetRow({
	className,
	invalid,
	...props
}: React.ComponentProps<"tr"> & { invalid?: boolean }) {
	const virtualIndex = React.useContext(SpreadsheetRowIndexContext);
	return (
		<tr
			data-slot="spreadsheet-row"
			data-index={virtualIndex ?? undefined}
			// 1-based, after the (single assumed) header row; grid navigation
			// restamps with the exact header count when enabled.
			aria-rowindex={virtualIndex === null ? undefined : virtualIndex + 2}
			data-invalid={invalid || undefined}
			className={cn("group/editable-row", className)}
			{...props}
		/>
	);
}

/**
 * Windowed rendering for large row sets (worth it from ~100 rows), driven by
 * `@tanstack/react-virtual`: only the visible slice of rows mounts, framed by
 * two spacer rows so the native table layout (colgroup widths, borders) stays
 * intact. `children` renders ONE row by absolute index - keep your usual
 * `SpreadsheetRow` markup there, keyed by your row's identity.
 *
 * Constraints: fixed-height rows (the kit's 32px + 1px rule - pass
 * `estimatedRowHeight` if yours differ), `stickyHeader` plus a `max-h-*`
 * container (the container is the scroll element), and no `onRowMove` row
 * dragging (positional drop targets don't survive windowing). Grid
 * navigation works: rows stamp their absolute `data-index`, so positions,
 * selection and paste targets stay correct; long jumps (PageUp/PageDown)
 * clamp to the mounted window.
 */
function SpreadsheetVirtualRows({
	count,
	estimatedRowHeight = 33,
	overscan = 8,
	children,
}: {
	/** Total number of rows, mounted or not. */
	count: number;
	/** Pixel height of one row, borders included. */
	estimatedRowHeight?: number;
	/** Extra rows rendered on both sides of the visible window. */
	overscan?: number;
	children: (index: number) => React.ReactNode;
}) {
	const { scrollContainer, setVirtualRowCount } =
		React.useContext(SpreadsheetContext);
	const virtualizer = useVirtualizer({
		count,
		getScrollElement: () => scrollContainer,
		estimateSize: () => estimatedRowHeight,
		overscan,
	});
	React.useEffect(() => {
		setVirtualRowCount(count);
		return () => setVirtualRowCount(null);
	}, [count, setVirtualRowCount]);
	const items = virtualizer.getVirtualItems();
	const paddingTop = items[0]?.start ?? 0;
	const paddingBottom = virtualizer.getTotalSize() - (items.at(-1)?.end ?? 0);
	return (
		<>
			<SpreadsheetVirtualSpacer height={paddingTop} />
			{items.map((item) => (
				<SpreadsheetRowIndexContext.Provider key={item.key} value={item.index}>
					{children(item.index)}
				</SpreadsheetRowIndexContext.Provider>
			))}
			<SpreadsheetVirtualSpacer height={paddingBottom} />
		</>
	);
}

/** Keeps the scrollbar honest for the unmounted rows above/below the window. */
function SpreadsheetVirtualSpacer({ height }: { height: number }) {
	if (height <= 0) {
		return null;
	}
	return (
		<tr data-slot="spreadsheet-virtual-spacer">
			<td
				aria-hidden="true"
				colSpan={1000}
				className="border-0 p-0"
				style={{ height }}
			/>
		</tr>
	);
}

/**
 * The `control` variant melts the kit's form controls into the cell: borders,
 * radii, backgrounds and focus/invalid rings are stripped off the control and
 * replaced by an `inset-ring` on the `<td>` (a plain `ring` would be clipped
 * by adjacent cells under border-collapse; the separate family also never
 * collides with the controls' own `ring-*` classes). Traps encoded below:
 *
 * - `MoneyInput` overwrites its `InputGroup`'s slot with
 *   `data-slot="money-input"`, so group flattening targets `fieldset[data-slot]`,
 *   never `[data-slot=input-group]`.
 * - The group's inner input is `data-slot="input-group-control"` and already
 *   flattened by `InputGroupInput`; only the fieldset needs neutralizing.
 * - `InputGroup` raises its rings with `has-[...]` selectors, so the `ring-0`
 *   overrides must repeat the same `:has(...)` to win on specificity.
 * - `border-0` zeroes the border width, so color-only rules like
 *   `aria-invalid:border-destructive` become inert - no specificity battle.
 * - Never force `text-sm` on inputs: `text-base md:text-sm` in `input.tsx` is
 *   an iOS anti-zoom guard.
 * - `mx-auto` + the cell's `align-middle` center Checkbox/Switch without
 *   turning the td into a flex box; Switch is inline-flex, so it also gets
 *   `flex` (auto margins only center block-level boxes).
 */
const editableTableCellVariants = cva({
	base: "relative border-r border-b border-input align-middle last:border-r-0 group-data-[invalid=true]/editable-row:bg-destructive/5",
	variants: {
		variant: {
			text: "px-2.5 py-1.5 whitespace-nowrap text-muted-foreground",
			control: cn(
				"p-0 focus-within:z-1",
				// Cell-level focus/invalid rings, replacing the controls' own. The
				// focus ring is scoped to valid cells and the focused+invalid state
				// stacks two :has(), so the destructive ring wins on specificity
				// instead of depending on rule order in the generated stylesheet.
				"not-has-[[aria-invalid=true]]:has-[:focus-visible]:inset-ring-2 not-has-[[aria-invalid=true]]:has-[:focus-visible]:inset-ring-ring/70",
				"has-[[aria-invalid=true]]:bg-destructive/5 has-[[aria-invalid=true]]:inset-ring-2 has-[[aria-invalid=true]]:inset-ring-destructive/30",
				"has-[[aria-invalid=true]]:has-[:focus-visible]:inset-ring-destructive/60",
				// Flatten Input / Textarea.
				"[&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:shadow-none",
				"[&_[data-slot=input]:focus-visible]:ring-0 [&_[data-slot=input][aria-invalid=true]]:ring-0",
				"[&_[data-slot=input]:disabled]:bg-transparent dark:[&_[data-slot=input]]:bg-transparent",
				// Flatten NativeSelect (the border lives on the inner <select>).
				"[&_[data-slot=native-select]]:rounded-none [&_[data-slot=native-select]]:border-0",
				"[&_[data-slot=native-select]:focus-visible]:ring-0 [&_[data-slot=native-select][aria-invalid=true]]:ring-0",
				"dark:[&_[data-slot=native-select]]:bg-transparent",
				// Flatten InputGroup AND MoneyInput - see the data-slot trap above.
				"[&_fieldset[data-slot]]:rounded-none [&_fieldset[data-slot]]:border-0 [&_fieldset[data-slot]]:ring-0",
				"[&_fieldset[data-slot]:has([data-slot=input-group-control]:focus-visible)]:ring-0",
				"[&_fieldset[data-slot]:has([data-slot][aria-invalid=true])]:ring-0",
				"dark:[&_fieldset[data-slot]]:bg-transparent",
				// Flatten TranslationInput's trailing locale select (the group
				// itself is already covered by the fieldset[data-slot] rules).
				"[&_[data-slot=translation-input-locale]:focus-visible]:ring-0",
				// NestedTableInput fills its cell and defers ring/tint to it.
				"[&_[data-slot=nested-table-input]]:rounded-none [&_[data-slot=nested-table-input]]:border-0",
				"[&_[data-slot=nested-table-input]:focus-visible]:ring-0",
				// Center non-filling controls; cut their rings.
				"[&_[data-slot=checkbox]]:mx-auto [&_[data-slot=switch]]:mx-auto [&_[data-slot=switch]]:flex",
				"[&_[data-slot=checkbox]:focus-visible]:ring-0 [&_[data-slot=switch]:focus-visible]:ring-0",
			),
		},
	},
	defaultVariants: { variant: "control" },
});

// Computed once: the control variant is a large string and runs through
// twMerge, no reason to redo that per cell per render.
const controlCellClassName = editableTableCellVariants({ variant: "control" });
const textCellClassName = editableTableCellVariants({ variant: "text" });

/**
 * Hosts exactly one form control. Clicking the cell's empty space forwards
 * focus to the control (or, under `gridNavigation`, to the cell itself); a
 * consumer `onClick` runs first and can cancel the forwarding with
 * `event.preventDefault()`. Clicks landing on interactive content
 * (Checkbox/Switch render `<button>`s) are left alone.
 */
function SpreadsheetCell({
	className,
	onClick,
	value,
	...props
}: React.ComponentProps<"td"> & {
	/**
	 * What `gridNavigation` copy serializes for this cell instead of the inner
	 * control's DOM value - required for controls whose DOM value isn't the
	 * data (Checkbox, Switch), useful whenever the copied text should differ
	 * from what the control displays.
	 */
	value?: string;
}) {
	const { gridNavigation } = React.useContext(SpreadsheetContext);
	return (
		<td
			data-slot="spreadsheet-cell"
			data-grid-value={value}
			className={cn(controlCellClassName, className)}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) {
					return;
				}
				const target = event.target as HTMLElement;
				if (target.closest("button, a, input, select, textarea, label")) {
					return;
				}
				if (gridNavigation) {
					// Navigation mode owns plain clicks; editing starts from the
					// control itself, Enter, F2 or typing.
					event.currentTarget.focus();
					return;
				}
				event.currentTarget
					.querySelector<HTMLElement>(
						"input, select, textarea, button, [tabindex]",
					)
					?.focus();
			}}
			{...props}
		/>
	);
}

/** Read-only cell (row labels, computed values) in the same dense grid. */
function SpreadsheetCellText({
	className,
	...props
}: React.ComponentProps<"td">) {
	return (
		<td
			data-slot="spreadsheet-cell-text"
			className={cn(textCellClassName, className)}
			{...props}
		/>
	);
}

/** Thumbnail, spinner or empty placeholder - whichever the cell's state calls for. */
function SpreadsheetImagePreview({
	src,
	alt,
	uploading,
}: {
	src: string | null | undefined;
	alt: string;
	uploading: boolean;
}) {
	if (uploading) {
		return (
			<SpinnerIcon
				aria-hidden="true"
				className="size-4 animate-spin text-muted-foreground"
			/>
		);
	}
	if (src === null || src === undefined || src.length === 0) {
		return (
			<ImageIcon
				aria-hidden="true"
				className="size-4 text-muted-foreground/50 group-hover/image-cell:text-muted-foreground"
			/>
		);
	}
	// `object-contain` over `cover`: catalogue shots are packshots on white,
	// cropping them to a 24px square would cut the product out of frame.
	return (
		<img
			src={src}
			alt={alt}
			className="size-6 rounded-sm object-contain"
			draggable={false}
		/>
	);
}

/**
 * Image cell: a thumbnail that imports a file three ways - click to open the
 * picker, drop a file onto the cell, or paste one from the clipboard while the
 * cell is focused. Presentational like every other part: it neither uploads
 * nor holds the file. `onFileSelect` hands over the picked `File` (upload it,
 * then feed the resulting URL back as `src`) and `uploading` swaps the
 * thumbnail for a spinner while that runs.
 *
 * Under `gridNavigation` the cell copies as `value` (the slug or id behind the
 * image, not the URL) - declaring it is what keeps the hidden file input from
 * being serialized as the cell's value.
 */
function SpreadsheetCellImage({
	src,
	alt = "",
	value = "",
	onFileSelect,
	onRemove,
	uploading = false,
	disabled = false,
	accept = "image/*",
	pickLabel,
	removeLabel,
	className,
	...props
}: Omit<React.ComponentProps<"td">, "onDrop" | "onPaste"> & {
	/** Displayed thumbnail URL; empty or null renders the placeholder. */
	src?: string | null;
	/** Alt text of the thumbnail - the row's label, not "image". */
	alt?: string;
	/** What `gridNavigation` copy serializes for this cell. */
	value?: string;
	onFileSelect: (file: File) => void;
	/** Omit to make the image non-clearable (no remove affordance is drawn). */
	onRemove?: () => void;
	uploading?: boolean;
	disabled?: boolean;
	accept?: string;
	/** Accessible name of the picker button, e.g. "Import an image, row 3". */
	pickLabel: string;
	removeLabel?: string;
}) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const { dragging, cellProps } = useSpreadsheetImageDrop({
		onFileSelect,
		disabled: disabled || uploading,
	});
	const hasImage = src !== null && src !== undefined && src.length > 0;
	return (
		<td
			data-slot="spreadsheet-cell"
			data-grid-value={value}
			className={cn(
				"group/image-cell relative border-r border-b border-input p-0 text-center align-middle last:border-r-0",
				dragging && "inset-ring-2 inset-ring-ring/70 bg-primary/10",
				className,
			)}
			{...cellProps}
			{...props}
		>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				className="hidden"
				tabIndex={-1}
				onChange={(event) => {
					const file = event.target.files?.[0];
					// Cleared so picking the SAME file twice in a row still fires
					// `change` (the browser skips it when the value is unchanged).
					event.target.value = "";
					if (file !== undefined) {
						onFileSelect(file);
					}
				}}
			/>
			<button
				type="button"
				aria-label={pickLabel}
				disabled={disabled || uploading}
				className="flex h-8 w-full items-center justify-center outline-none hover:bg-muted/50 focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70 disabled:pointer-events-none disabled:opacity-50"
				onClick={() => inputRef.current?.click()}
			>
				<SpreadsheetImagePreview src={src} alt={alt} uploading={uploading} />
			</button>
			{hasImage && onRemove !== undefined && removeLabel !== undefined ? (
				<button
					type="button"
					aria-label={removeLabel}
					disabled={disabled || uploading}
					// Pointer-revealed, but always reachable: focus brings it back for
					// keyboard users, who have no hover to trigger it with.
					className="absolute top-0.5 right-0.5 hidden size-4 place-items-center rounded-full bg-background text-muted-foreground outline-none group-hover/image-cell:grid hover:text-destructive focus-visible:grid focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70"
					onClick={onRemove}
				>
					<XIcon aria-hidden="true" className="size-2.5" />
				</button>
			) : null}
		</td>
	);
}

/**
 * Trailing cell for per-row actions - put `<Button variant="ghost"
 * size="icon-sm" aria-label=... />` inside.
 */
function SpreadsheetRowActions({
	className,
	...props
}: React.ComponentProps<"td">) {
	return (
		<td
			data-slot="spreadsheet-row-actions"
			className={cn(
				"relative w-0 border-r border-b border-input px-1 text-center align-middle whitespace-nowrap last:border-r-0",
				className,
			)}
			{...props}
		/>
	);
}

/**
 * Grab-handle cell for row reordering; needs `onRowMove` on the table and the
 * row's current `index`. Pointer: drag the handle vertically, a drop line
 * marks the target. Keyboard: Space grabs the row, ArrowUp/ArrowDown pick the
 * position, Space drops, Escape cancels (steps are announced politely).
 * Render it as the row's first cell so the handle stays predictable.
 */
function SpreadsheetDragHandle({
	index,
	className,
	"aria-label": ariaLabel = "Reorder row",
	...props
}: React.ComponentProps<"td"> & { index: number }) {
	const { onRowMove, setDropLine, announce } =
		React.useContext(SpreadsheetContext);
	const buttonProps = useSpreadsheetRowDrag({
		index,
		onRowMove,
		setDropLine,
		announce,
	});
	return (
		<td
			data-slot="spreadsheet-drag-handle"
			className={cn(
				"relative w-0 border-r border-b border-input p-0 text-center align-middle last:border-r-0",
				className,
			)}
			{...props}
		>
			<button
				type="button"
				aria-label={ariaLabel}
				aria-roledescription="sortable row"
				className="flex h-8 w-full min-w-7 cursor-grab touch-none items-center justify-center text-muted-foreground outline-none select-none hover:text-foreground focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70 active:cursor-grabbing data-[grabbed=true]:text-foreground"
				{...buttonProps}
			>
				<DotsSixVerticalIcon aria-hidden="true" className="size-4" />
			</button>
		</td>
	);
}

/**
 * Full-width "add a row" affordance rendered as the table's last row.
 * `colSpan` must count ALL columns, the actions column included. All props
 * (`className` included) go to the inner `<button>`; the wrapping row and
 * cell are not styleable from the outside.
 */
function SpreadsheetAddRow({
	colSpan,
	className,
	children,
	...props
}: React.ComponentProps<"button"> & { colSpan: number }) {
	return (
		<tr data-slot="spreadsheet-add-row">
			<td colSpan={colSpan} className="border-t border-input p-0">
				<button
					type="button"
					className={cn(
						"flex h-8 w-full items-center gap-2 px-2.5 text-sm text-muted-foreground outline-none hover:bg-muted/50 hover:text-foreground focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70 disabled:pointer-events-none disabled:opacity-50",
						className,
					)}
					{...props}
				>
					<PlusIcon aria-hidden="true" className="size-4" />
					{children}
				</button>
			</td>
		</tr>
	);
}

/**
 * Full-width "add a row" button for the mobile card mode - pass it through
 * the table's `mobileAddRow` prop, wired like the desktop
 * `SpreadsheetAddRow`.
 */
function SpreadsheetMobileAddRow({
	className,
	children,
	...props
}: React.ComponentProps<"button">) {
	return (
		<button
			type="button"
			data-slot="spreadsheet-mobile-add-row"
			className={cn(
				"flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-input border-dashed px-2.5 text-sm text-muted-foreground outline-none hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<PlusIcon aria-hidden="true" className="size-4" />
			{children}
		</button>
	);
}

/**
 * Loading placeholder rows, sized exactly like real rows (32px + 1px rule) so
 * the swap to live data causes no layout shift. Renders inside
 * `SpreadsheetBody`; the rows are `aria-hidden`, announce the load
 * elsewhere (e.g. a `role="status"` region near the table).
 */
function SpreadsheetSkeleton({
	rows = 3,
	columns,
}: {
	rows?: number;
	columns: number;
}) {
	return (
		<>
			{Array.from({ length: rows }, (_, rowIndex) => (
				<SpreadsheetRow
					key={rowIndex}
					aria-hidden="true"
					data-slot="spreadsheet-skeleton-row"
				>
					{Array.from({ length: columns }, (_, columnIndex) => (
						<SpreadsheetCellText key={columnIndex}>
							<Skeleton className="h-5 w-full" />
						</SpreadsheetCellText>
					))}
				</SpreadsheetRow>
			))}
		</>
	);
}

/**
 * The spreadsheet, as one namespace: `Spreadsheet.Root` owns the state and the
 * keyboard grid, every other part draws into it.
 */
const Spreadsheet = {
	Root: SpreadsheetRoot,
	Columns: SpreadsheetColumns,
	Column: SpreadsheetColumn,
	Header: SpreadsheetHeader,
	Head: SpreadsheetHead,
	Body: SpreadsheetBody,
	Row: SpreadsheetRow,
	VirtualRows: SpreadsheetVirtualRows,
	Cell: SpreadsheetCell,
	CellText: SpreadsheetCellText,
	CellImage: SpreadsheetCellImage,
	RowActions: SpreadsheetRowActions,
	DragHandle: SpreadsheetDragHandle,
	AddRow: SpreadsheetAddRow,
	MobileAddRow: SpreadsheetMobileAddRow,
	Skeleton: SpreadsheetSkeleton,
};

export {
	Spreadsheet,
	type SpreadsheetPasteData,
	type SpreadsheetRootProps,
	type SpreadsheetSort,
	type SpreadsheetSortDirection,
};
