import {
	CaretDownIcon,
	CaretRightIcon as CaretExpandIcon,
	CaretLeftIcon,
	CaretRightIcon,
	CaretUpDownIcon,
	CaretUpIcon,
	ColumnsIcon,
	DownloadSimpleIcon,
	ListMagnifyingGlassIcon,
	MagnifyingGlassIcon,
	RowsIcon,
} from "@phosphor-icons/react";
import {
	type Cell,
	type Column,
	type ColumnDef,
	type ColumnPinningState,
	type ColumnSizingState,
	type ExpandedState,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type Header,
	type HeaderGroup,
	type OnChangeFn,
	type Row,
	type RowSelectionState,
	type SortDirection,
	type SortingState,
	type Table as TanstackTable,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { Button } from "#/components/button.tsx";
import { Checkbox } from "#/components/checkbox.tsx";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/dropdown-menu.tsx";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/components/empty.tsx";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/input-group.tsx";
import { PaginationEllipsis } from "#/components/pagination.tsx";
import { Spinner } from "#/components/spinner.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/table.tsx";
import {
	PAGINATION_ELLIPSIS,
	usePagination,
} from "#/datatable/hooks/use-pagination.ts";
import { cn } from "#/lib/utils.ts";

// Re-exported so consumers can type their `columns` without depending on
// @tanstack/react-table directly.
export type {
	ColumnDef,
	ColumnOrderState,
	ColumnPinningState,
	ColumnSizingState,
	ExpandedState,
	Row,
	RowSelectionState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";

/**
 * Emplacement row above a `DataTable`: search at the start, filter controls
 * next to it, end-aligned actions via `DataTableActions`. Wraps on narrow
 * screens instead of overflowing.
 */
function DataTableToolbar({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="data-table-toolbar"
			className={cn("flex flex-wrap items-center gap-2", className)}
			{...props}
		/>
	);
}

/**
 * Search emplacement for the toolbar - a leading-icon search input. Controlled
 * like a plain input (`value`/`onChange`); debouncing and where the filtering
 * happens (client or server) stay with the consumer. `className` sizes the
 * group; all other props go to the input itself.
 */
function DataTableSearch({
	className,
	...props
}: React.ComponentProps<typeof InputGroupInput>) {
	return (
		<InputGroup
			data-slot="data-table-search"
			className={cn("w-full sm:w-64", className)}
		>
			<InputGroupInput type="search" {...props} />
			<InputGroupAddon>
				<MagnifyingGlassIcon />
			</InputGroupAddon>
		</InputGroup>
	);
}

/**
 * Filters emplacement for the toolbar - groups selects, checkbox groups,
 * toggle filters... so every table lays them out the same way.
 */
function DataTableFilters({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			role="group"
			data-slot="data-table-filters"
			className={cn("flex flex-wrap items-center gap-2", className)}
			{...props}
		/>
	);
}

/**
 * End-aligned slot of the toolbar for bulk/primary actions (export, create,
 * delete selection...).
 */
function DataTableActions({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="data-table-actions"
			className={cn("ms-auto flex items-center gap-2", className)}
			{...props}
		/>
	);
}

type DataTableSelectionColumnOptions<TData> = {
	selectAllLabel?: string;
	selectRowLabel?: (row: TData) => string;
};

/**
 * Leading checkbox column wired to the table's row-selection state. Spread it
 * first in `columns` and enable selection on the `DataTable`. Checkbox clicks
 * never bubble into `onRowClick`.
 */
function dataTableSelectionColumn<TData>({
	selectAllLabel = "Select all rows",
	selectRowLabel = () => "Select row",
}: DataTableSelectionColumnOptions<TData> = {}): ColumnDef<TData> {
	return {
		id: "select",
		size: 36,
		enableSorting: false,
		header: ({ table }) => (
			<Checkbox
				aria-label={selectAllLabel}
				checked={table.getIsAllPageRowsSelected()}
				indeterminate={
					table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
				}
				onCheckedChange={(checked) =>
					table.toggleAllPageRowsSelected(checked === true)
				}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				aria-label={selectRowLabel(row.original)}
				checked={row.getIsSelected()}
				disabled={!row.getCanSelect()}
				onCheckedChange={(checked) => row.toggleSelected(checked === true)}
				onClick={(event) => event.stopPropagation()}
			/>
		),
	};
}

export type DataTablePaginationProps = {
	/** Zero-based page index. */
	page: number;
	pageSize: number;
	/** Total number of rows across all pages (server-side count). */
	total: number;
	onPageChange: (page: number) => void;
	/** Pages shown on each side of the current page (windowed with ellipses). */
	siblingCount?: number;
	previousText?: string;
	nextText?: string;
	/** Localizable "1-10 of 42" range line; receives 1-based row positions. */
	rangeText?: (range: {
		from: number;
		to: number;
		total: number;
	}) => React.ReactNode;
	/** Localizable aria-label for a page button; receives the 1-based number. */
	pageLabel?: (pageNumber: number) => string;
};

/**
 * Pagination footer: row range on the left, windowed page numbers (hidden on
 * mobile) with previous/next on the right. State-driven (`onPageChange`)
 * rather than link-driven - for URL-backed pagination use the `Pagination`
 * components directly.
 */
function DataTablePagination({
	page,
	pageSize,
	total,
	onPageChange,
	siblingCount = 1,
	previousText = "Previous",
	nextText = "Next",
	rangeText = ({ from, to, total: totalRows }) =>
		`${from}-${to} of ${totalRows}`,
	pageLabel = (pageNumber) => `Go to page ${pageNumber}`,
}: DataTablePaginationProps) {
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : page * pageSize + 1;
	const to = Math.min(total, (page + 1) * pageSize);
	const items = usePagination({ page, pageCount, siblingCount });

	return (
		<div
			data-slot="data-table-pagination"
			className="flex items-center justify-between gap-4 px-1 pt-3"
		>
			<span className="text-muted-foreground text-sm">
				{rangeText({ from, to, total })}
			</span>
			{pageCount > 1 && (
				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page === 0}
						aria-label={previousText}
						onClick={() => onPageChange(page - 1)}
					>
						<CaretLeftIcon data-icon="inline-start" />
						<span className="hidden sm:inline">{previousText}</span>
					</Button>
					<div className="hidden items-center gap-0.5 sm:flex">
						{items.map((item, index) =>
							item === PAGINATION_ELLIPSIS ? (
								// At most two ellipses; the position in the row identifies them.
								<PaginationEllipsis
									key={`ellipsis-${index}`}
									className="size-7"
								/>
							) : (
								<Button
									key={item}
									type="button"
									variant={item === page ? "outline" : "ghost"}
									size="icon-sm"
									aria-label={pageLabel(item + 1)}
									aria-current={item === page ? "page" : undefined}
									onClick={() => onPageChange(item)}
								>
									{item + 1}
								</Button>
							),
						)}
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page >= pageCount - 1}
						aria-label={nextText}
						onClick={() => onPageChange(page + 1)}
					>
						<span className="hidden sm:inline">{nextText}</span>
						<CaretRightIcon data-icon="inline-end" />
					</Button>
				</div>
			)}
		</div>
	);
}

type DataTableEmptyProps = {
	title?: string;
	description?: string;
};

function DataTableEmpty({
	title = "No results",
	description = "Try adjusting your search or filters.",
}: DataTableEmptyProps) {
	return (
		<Empty className="py-8">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<ListMagnifyingGlassIcon />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export type DataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[];
	data: readonly TData[];
	/** Sorting is managed internally; this seeds the initial column order. */
	initialSorting?: SortingState;
	/** When set, rows become clickable and invoke this with the row's data. */
	onRowClick?: (row: TData) => void;
	/** Refetch in progress: keeps the current rows visible under a spinner. */
	loading?: boolean;
	/** Custom empty state; defaults to a generic "No results" block. */
	emptyState?: React.ReactNode;
	/** Server-side pagination footer rendered below the table. */
	pagination?: DataTablePaginationProps;
	/**
	 * Emplacement rendered above the table - compose `DataTableToolbar` with
	 * `DataTableSearch`, `DataTableFilters` and `DataTableActions`.
	 */
	toolbar?:
		| React.ReactNode
		| ((table: TanstackTable<TData>) => React.ReactNode);
	/** Per-row or table-wide opt-in, forwarded to @tanstack/react-table. */
	enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
	/** Controlled selection state; omit to let the table own it. */
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: (state: RowSelectionState) => void;
	/** Stable row ids for selection across pages; defaults to the row index. */
	getRowId?: (row: TData, index: number) => string;
	/**
	 * Keeps the header row visible while the body scrolls. Needs a bounded
	 * height on the scroll container - pass e.g. `max-h-96` through
	 * `containerClassName`.
	 */
	stickyHeader?: boolean;
	/** Forwarded to the underlying `Table` scroll container. */
	containerClassName?: string;
	/**
	 * Card content for one row on mobile. When provided, the table is replaced
	 * below the `md` breakpoint by a vertical list of cards (no horizontal
	 * scroll) built from the sorted row model; cards stay clickable through
	 * `onRowClick`. The toolbar and pagination footer remain visible.
	 */
	renderMobileCard?: (row: TData) => React.ReactNode;
	/**
	 * Lets the user drag column edges. Widths live in the table's own state, so
	 * `onColumnSizingChange` is only needed to persist them across mounts.
	 */
	enableColumnResizing?: boolean;
	columnSizing?: ColumnSizingState;
	onColumnSizingChange?: (state: ColumnSizingState) => void;
	/** Controlled column visibility; pair with `DataTableViewOptions`. */
	columnVisibility?: VisibilityState;
	onColumnVisibilityChange?: (state: VisibilityState) => void;
	/**
	 * Columns frozen against an edge while the rest pans horizontally, by id:
	 * `{ left: ["name"], right: ["actions"] }`.
	 */
	columnPinning?: ColumnPinningState;
	onColumnPinningChange?: (state: ColumnPinningState) => void;
	/** Row height. `compact` fits about a third more rows on a screen. */
	density?: DataTableDensity;
	/**
	 * Detail panel for an expanded row, rendered as a full-width row beneath it.
	 * Rows become expandable and grow a caret in the first cell.
	 */
	renderExpandedRow?: (row: TData) => React.ReactNode;
	/**
	 * Client-side search across every visible cell. Leave undefined for
	 * server-side search (drive `DataTableSearch` yourself instead).
	 */
	globalFilter?: string;
	className?: string;
};

/** Row height. `compact` fits about a third more rows on a screen. */
export type DataTableDensity = "comfortable" | "compact";

const DENSITY_CELL_CLASS: Record<DataTableDensity, string> = {
	comfortable: "",
	compact: "[&_td]:py-1 [&_th]:py-1 [&_td]:text-[0.8rem]",
};

/**
 * A piece of state the caller may or may not own. Returns the live value and a
 * TanStack updater that writes to whichever side is in charge, so every feature
 * works uncontrolled by default and controlled when a prop is passed.
 */
function useOptionalControlled<TState>(
	controlled: TState | undefined,
	onChange: ((state: TState) => void) | undefined,
	initial: TState,
): [TState, OnChangeFn<TState>] {
	const [internal, setInternal] = React.useState<TState>(initial);
	const value = controlled ?? internal;
	const handleChange: OnChangeFn<TState> = (updater) => {
		const next =
			typeof updater === "function"
				? (updater as (old: TState) => TState)(value)
				: updater;
		if (controlled === undefined) {
			setInternal(next);
		}
		onChange?.(next);
	};
	return [value, handleChange];
}

function useDataTable<TData, TValue>({
	columns,
	data,
	initialSorting,
	enableRowSelection,
	rowSelection,
	onRowSelectionChange,
	getRowId,
	enableColumnResizing,
	columnSizing,
	onColumnSizingChange,
	columnVisibility,
	onColumnVisibilityChange,
	columnPinning,
	onColumnPinningChange,
	renderExpandedRow,
	globalFilter,
}: Pick<
	DataTableProps<TData, TValue>,
	| "columns"
	| "data"
	| "initialSorting"
	| "enableRowSelection"
	| "rowSelection"
	| "onRowSelectionChange"
	| "getRowId"
	| "enableColumnResizing"
	| "columnSizing"
	| "onColumnSizingChange"
	| "columnVisibility"
	| "onColumnVisibilityChange"
	| "columnPinning"
	| "onColumnPinningChange"
	| "renderExpandedRow"
	| "globalFilter"
>) {
	const [sorting, setSorting] = React.useState<SortingState>(
		initialSorting ?? [],
	);
	const [selection, handleSelectionChange] = useOptionalControlled(
		rowSelection,
		onRowSelectionChange,
		{} as RowSelectionState,
	);
	const [sizing, handleSizingChange] = useOptionalControlled(
		columnSizing,
		onColumnSizingChange,
		{} as ColumnSizingState,
	);
	const [visibility, handleVisibilityChange] = useOptionalControlled(
		columnVisibility,
		onColumnVisibilityChange,
		{} as VisibilityState,
	);
	const [pinning, handlePinningChange] = useOptionalControlled(
		columnPinning,
		onColumnPinningChange,
		{ left: [], right: [] } as ColumnPinningState,
	);
	const [expanded, setExpanded] = React.useState<ExpandedState>({});

	return useReactTable({
		data: data as TData[],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		onSortingChange: setSorting,
		enableRowSelection,
		onRowSelectionChange: handleSelectionChange,
		enableColumnResizing,
		columnResizeMode: "onChange",
		onColumnSizingChange: handleSizingChange,
		onColumnVisibilityChange: handleVisibilityChange,
		onColumnPinningChange: handlePinningChange,
		onExpandedChange: setExpanded,
		// Every row can open a detail panel when one is supplied; sub-rows are
		// not used, so the row model never nests.
		getRowCanExpand: () => renderExpandedRow !== undefined,
		getRowId,
		state: {
			sorting,
			rowSelection: selection,
			columnSizing: sizing,
			columnVisibility: visibility,
			columnPinning: pinning,
			expanded,
			globalFilter: globalFilter ?? "",
		},
	});
}

function DataTableLoadingOverlay({
	loading,
	className,
}: {
	loading: boolean;
	className?: string;
}) {
	if (!loading) {
		return null;
	}
	return (
		<div
			className={cn(
				"absolute inset-0 z-20 flex items-center justify-center bg-background/50",
				className,
			)}
		>
			<Spinner className="size-5 text-muted-foreground" />
		</div>
	);
}

function DataTableMobileCard<TData>({
	row,
	onRowClick,
	renderMobileCard,
}: {
	row: Row<TData>;
	onRowClick: ((row: TData) => void) | undefined;
	renderMobileCard: (row: TData) => React.ReactNode;
}) {
	if (onRowClick) {
		return (
			<button
				type="button"
				className="w-full rounded-md border bg-card p-3 text-left active:bg-muted/50"
				onClick={() => onRowClick(row.original)}
			>
				{renderMobileCard(row.original)}
			</button>
		);
	}
	return (
		<div className="rounded-md border bg-card p-3">
			{renderMobileCard(row.original)}
		</div>
	);
}

function DataTableMobileCardList<TData>({
	rows,
	loading,
	emptyState,
	onRowClick,
	renderMobileCard,
}: {
	rows: Row<TData>[];
	loading: boolean;
	emptyState: React.ReactNode;
	onRowClick: ((row: TData) => void) | undefined;
	renderMobileCard: ((row: TData) => React.ReactNode) | undefined;
}) {
	if (renderMobileCard === undefined) {
		return null;
	}
	return (
		<div data-slot="data-table-mobile-list" className="relative md:hidden">
			<DataTableLoadingOverlay loading={loading} className="rounded-md" />
			{rows.length ? (
				<ul className="flex flex-col gap-2">
					{rows.map((row) => (
						<li key={row.id}>
							<DataTableMobileCard
								row={row}
								onRowClick={onRowClick}
								renderMobileCard={renderMobileCard}
							/>
						</li>
					))}
				</ul>
			) : (
				<div className="rounded-md border">
					{emptyState ?? <DataTableEmpty />}
				</div>
			)}
		</div>
	);
}

const ARIA_SORT_BY_DIRECTION: Record<
	SortDirection,
	"ascending" | "descending"
> = {
	asc: "ascending",
	desc: "descending",
};

function DataTableSortCaret({
	canSort,
	sorted,
}: {
	canSort: boolean;
	sorted: false | SortDirection;
}) {
	if (sorted === "asc") {
		return <CaretUpIcon className="size-3.5 shrink-0" />;
	}
	if (sorted === "desc") {
		return <CaretDownIcon className="size-3.5 shrink-0" />;
	}
	if (canSort) {
		return (
			<CaretUpDownIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
		);
	}
	return null;
}

/**
 * Styles for a column frozen against an edge. The offset is the running width
 * of the columns pinned before it, so several can stack.
 */
function pinnedStyle<TData>(
	column: Column<TData, unknown>,
): React.CSSProperties | undefined {
	const side = column.getIsPinned();
	if (side === false) {
		return undefined;
	}
	return side === "left"
		? { position: "sticky", left: column.getStart("left"), zIndex: 2 }
		: { position: "sticky", right: column.getAfter("right"), zIndex: 2 };
}

function pinnedClass<TData>(column: Column<TData, unknown>): string | false {
	const side = column.getIsPinned();
	if (side === false) {
		return false;
	}
	return cn(
		// `bg-inherit` rather than a fixed colour: the row owns the background,
		// so a pinned cell follows hover, selection and expansion instead of
		// sitting there as an opaque patch that ignores them.
		"bg-inherit",
		// A border alone reads as just another column rule; the shadow is what
		// says "this floats above the content sliding under it". Mixed from
		// `--foreground` rather than black, so it darkens on a light theme and
		// glows on a dark one instead of vanishing into it.
		side === "left" &&
			column.getIsLastColumn("left") &&
			"border-r shadow-[6px_0_8px_-6px_color-mix(in_oklab,var(--foreground)_28%,transparent)]",
		side === "right" &&
			column.getIsFirstColumn("right") &&
			"border-l shadow-[-6px_0_8px_-6px_color-mix(in_oklab,var(--foreground)_28%,transparent)]",
	);
}

/**
 * The drag target that resizes a column. Sits on the header's trailing edge and
 * is also focusable, so the width is reachable without a pointer.
 */
function DataTableResizeHandle<TData>({
	header,
	table,
}: {
	header: Header<TData, unknown>;
	table: TanstackTable<TData>;
}) {
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

function DataTableHeadCell<TData>({
	header,
	resizable,
	table,
}: {
	header: Header<TData, unknown>;
	resizable: boolean;
	table: TanstackTable<TData>;
}) {
	const size = header.getSize();
	const isSized = header.column.columnDef.size !== undefined || resizable;
	const canSort = header.column.getCanSort();
	const sorted = header.column.getIsSorted();
	return (
		<TableHead
			aria-sort={sorted === false ? undefined : ARIA_SORT_BY_DIRECTION[sorted]}
			className={cn(
				"relative",
				canSort && "cursor-pointer select-none hover:bg-muted/50",
				pinnedClass(header.column),
			)}
			style={{
				...(isSized ? { width: size } : {}),
				...pinnedStyle(header.column),
			}}
			onClick={header.column.getToggleSortingHandler()}
		>
			<div
				className={cn("flex items-center gap-1", isSized && "overflow-hidden")}
			>
				<span className={isSized ? "truncate" : undefined}>
					{header.isPlaceholder
						? null
						: flexRender(header.column.columnDef.header, header.getContext())}
				</span>
				<DataTableSortCaret canSort={canSort} sorted={sorted} />
			</div>
			{resizable && header.column.getCanResize() && (
				<DataTableResizeHandle header={header} table={table} />
			)}
		</TableHead>
	);
}

function DataTableHeader<TData>({
	headerGroups,
	stickyHeader,
	resizable,
	table,
	expandable,
	pinned,
}: {
	headerGroups: HeaderGroup<TData>[];
	stickyHeader: boolean;
	resizable: boolean;
	table: TanstackTable<TData>;
	expandable: boolean;
	pinned: boolean;
}) {
	return (
		<TableHeader
			className={cn(
				// Sticky headers can't keep collapsed `tr` borders while
				// scrolling, so an inset shadow redraws the bottom rule.
				stickyHeader &&
					"sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)] [&_tr]:border-b-0",
			)}
		>
			{headerGroups.map((headerGroup) => (
				<TableRow
					key={headerGroup.id}
					className={cn(pinned && "bg-background")}
				>
					{/* The body renders a leading cell for the expander, so the header
					    has to as well or every column sits one place to the left. */}
					{expandable && (
						<TableHead className="w-10">
							<span className="sr-only">Expand row</span>
						</TableHead>
					)}
					{headerGroup.headers.map((header) => (
						<DataTableHeadCell
							key={header.id}
							header={header}
							resizable={resizable}
							table={table}
						/>
					))}
				</TableRow>
			))}
		</TableHeader>
	);
}

function DataTableBodyCell<TData>({
	cell,
	resizable,
}: {
	cell: Cell<TData, unknown>;
	resizable: boolean;
}) {
	const isSized = cell.column.columnDef.size !== undefined || resizable;
	return (
		<TableCell
			className={pinnedClass(cell.column) || undefined}
			style={{
				...(isSized ? { width: cell.column.getSize() } : {}),
				...pinnedStyle(cell.column),
			}}
		>
			<div className={isSized ? "truncate" : undefined}>
				{flexRender(cell.column.columnDef.cell, cell.getContext())}
			</div>
		</TableCell>
	);
}

function DataTableBodyRow<TData>({
	row,
	onRowClick,
	resizable,
	renderExpandedRow,
	columnCount,
	pinned,
}: {
	row: Row<TData>;
	onRowClick: ((row: TData) => void) | undefined;
	resizable: boolean;
	renderExpandedRow: ((row: TData) => React.ReactNode) | undefined;
	columnCount: number;
	pinned: boolean;
}) {
	const handleClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
		// Clicks on interactive cell content (selection checkbox, action
		// buttons, links) are not row activations.
		const target = event.target as HTMLElement;
		if (target.closest("button, a, input, label")) {
			return;
		}
		onRowClick?.(row.original);
	};
	const expandable = renderExpandedRow !== undefined;
	const expanded = expandable && row.getIsExpanded();
	return (
		<>
			<TableRow
				data-selected={row.getIsSelected() || undefined}
				data-expanded={expanded || undefined}
				className={cn(
					onRowClick && "cursor-pointer",
					pinned && "bg-background",
				)}
				onClick={onRowClick ? handleClick : undefined}
			>
				{expandable && (
					<TableCell className="w-10">
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-expanded={expanded}
							aria-label={expanded ? "Collapse row" : "Expand row"}
							onClick={row.getToggleExpandedHandler()}
						>
							<CaretExpandIcon
								className={cn("transition-transform", expanded && "rotate-90")}
							/>
						</Button>
					</TableCell>
				)}
				{row.getVisibleCells().map((cell) => (
					<DataTableBodyCell key={cell.id} cell={cell} resizable={resizable} />
				))}
			</TableRow>
			{expanded && (
				<TableRow data-slot="data-table-expanded-row">
					<TableCell
						colSpan={columnCount + (expandable ? 1 : 0)}
						className="whitespace-normal bg-muted/30"
					>
						{renderExpandedRow(row.original)}
					</TableCell>
				</TableRow>
			)}
		</>
	);
}

function DataTableDesktopTable<TData>({
	headerGroups,
	rows,
	columnCount,
	loading,
	emptyState,
	onRowClick,
	stickyHeader,
	containerClassName,
	hasFixedSizes,
	hiddenOnMobile,
	resizable,
	renderExpandedRow,
	density,
	table,
	pinned,
}: {
	headerGroups: HeaderGroup<TData>[];
	rows: Row<TData>[];
	columnCount: number;
	loading: boolean;
	emptyState: React.ReactNode;
	onRowClick: ((row: TData) => void) | undefined;
	stickyHeader: boolean;
	containerClassName: string | undefined;
	hasFixedSizes: boolean;
	hiddenOnMobile: boolean;
	resizable: boolean;
	renderExpandedRow: ((row: TData) => React.ReactNode) | undefined;
	density: DataTableDensity;
	table: TanstackTable<TData>;
	pinned: boolean;
}) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-md border",
				hiddenOnMobile && "hidden md:block",
			)}
		>
			<DataTableLoadingOverlay loading={loading} />
			<Table
				containerClassName={cn(
					stickyHeader && "overflow-y-auto",
					containerClassName,
				)}
				className={DENSITY_CELL_CLASS[density]}
				style={
					hasFixedSizes || resizable ? { tableLayout: "fixed" } : undefined
				}
			>
				<DataTableHeader
					headerGroups={headerGroups}
					stickyHeader={stickyHeader}
					resizable={resizable}
					table={table}
					expandable={renderExpandedRow !== undefined}
					pinned={pinned}
				/>
				<TableBody>
					<DataTableRows
						rows={rows}
						columnCount={columnCount}
						emptyState={emptyState}
						onRowClick={onRowClick}
						resizable={resizable}
						renderExpandedRow={renderExpandedRow}
						pinned={pinned}
					/>
				</TableBody>
			</Table>
		</div>
	);
}

function DataTableRows<TData>({
	rows,
	columnCount,
	emptyState,
	onRowClick,
	resizable,
	renderExpandedRow,
	pinned,
}: {
	rows: Row<TData>[];
	columnCount: number;
	emptyState: React.ReactNode;
	onRowClick: ((row: TData) => void) | undefined;
	resizable: boolean;
	renderExpandedRow: ((row: TData) => React.ReactNode) | undefined;
	pinned: boolean;
}) {
	if (!rows.length) {
		return (
			<TableRow>
				<TableCell
					colSpan={columnCount + (renderExpandedRow === undefined ? 0 : 1)}
					className="whitespace-normal"
				>
					{emptyState ?? <DataTableEmpty />}
				</TableCell>
			</TableRow>
		);
	}
	return (
		<>
			{rows.map((row) => (
				<DataTableBodyRow
					key={row.id}
					row={row}
					onRowClick={onRowClick}
					resizable={resizable}
					renderExpandedRow={renderExpandedRow}
					columnCount={columnCount}
					pinned={pinned}
				/>
			))}
		</>
	);
}

/**
 * Column visibility menu. Every hideable column gets a checkbox; the table owns
 * the state unless `columnVisibility` is passed to `DataTable`.
 */
function DataTableViewOptions<TData>({
	table,
	label = "Columns",
	className,
}: {
	table: TanstackTable<TData>;
	label?: string;
	className?: string;
}) {
	const columns = table
		.getAllLeafColumns()
		.filter((column) => column.getCanHide());
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="outline" size="sm" className={className}>
						<ColumnsIcon />
						{label}
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuLabel>{label}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{columns.map((column) => (
					<DropdownMenuCheckboxItem
						key={column.id}
						checked={column.getIsVisible()}
						onCheckedChange={(checked) => column.toggleVisibility(checked)}
					>
						{typeof column.columnDef.header === "string"
							? column.columnDef.header
							: column.id}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

/** Row-height switch, for tables people scan rather than read. */
function DataTableDensityToggle({
	density,
	onDensityChange,
	label = "Density",
	labels = { comfortable: "Comfortable", compact: "Compact" },
	className,
}: {
	density: DataTableDensity;
	onDensityChange: (density: DataTableDensity) => void;
	label?: string;
	labels?: Record<DataTableDensity, string>;
	className?: string;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="outline" size="sm" className={className}>
						<RowsIcon />
						{label}
					</Button>
				}
			/>
			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup
					value={density}
					onValueChange={(value) => onDensityChange(value as DataTableDensity)}
				>
					<DropdownMenuRadioItem value="comfortable">
						{labels.comfortable}
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="compact">
						{labels.compact}
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

/** RFC 4180: quotes double up, and any field containing them is quoted. */
function toCsvField(value: unknown): string {
	const text = value === null || value === undefined ? "" : String(value);
	return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/**
 * Serializes the rows the user is currently looking at — filtered and sorted,
 * visible columns only — to CSV. Exported so a consumer can send the same bytes
 * somewhere other than a download.
 */
function dataTableToCsv<TData>(table: TanstackTable<TData>): string {
	const columns = table.getVisibleLeafColumns();
	const header = columns.map((column) =>
		toCsvField(
			typeof column.columnDef.header === "string"
				? column.columnDef.header
				: column.id,
		),
	);
	const rows = table
		.getSortedRowModel()
		.rows.map((row) =>
			columns.map((column) => toCsvField(row.getValue(column.id))),
		);
	return [header, ...rows].map((cells) => cells.join(",")).join("\r\n");
}

/** Downloads the current view as CSV. */
function DataTableExport<TData>({
	table,
	filename = "export.csv",
	label = "Export",
	className,
}: {
	table: TanstackTable<TData>;
	filename?: string;
	label?: string;
	className?: string;
}) {
	const download = () => {
		const blob = new Blob([dataTableToCsv(table)], {
			type: "text/csv;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = filename;
		anchor.click();
		URL.revokeObjectURL(url);
	};
	return (
		<Button
			variant="outline"
			size="sm"
			className={className}
			onClick={download}
		>
			<DownloadSimpleIcon />
			{label}
		</Button>
	);
}

/**
 * The kit's table recipe: `Table` + sorting + row selection + sticky header +
 * windowed pagination, with toolbar emplacements for search and filters, and
 * the classic extras behind opt-in props — column resizing, visibility,
 * pinning, density, row expansion and CSV export.
 *
 * Column sizing: when any column sets a numeric `size` (or resizing is on) the
 * table switches to fixed layout and sized cells truncate instead of
 * stretching.
 *
 * `toolbar` is a render prop when it needs the table instance — the controls
 * that drive columns (`DataTableViewOptions`, `DataTableExport`) do.
 */
function DataTable<TData, TValue>({
	columns,
	data,
	initialSorting,
	onRowClick,
	loading = false,
	emptyState,
	pagination,
	toolbar,
	enableRowSelection = false,
	rowSelection,
	onRowSelectionChange,
	getRowId,
	stickyHeader = false,
	containerClassName,
	renderMobileCard,
	enableColumnResizing = false,
	columnSizing,
	onColumnSizingChange,
	columnVisibility,
	onColumnVisibilityChange,
	columnPinning,
	onColumnPinningChange,
	density = "comfortable",
	renderExpandedRow,
	globalFilter,
	className,
}: DataTableProps<TData, TValue>) {
	const table = useDataTable({
		columns,
		data,
		initialSorting,
		enableRowSelection,
		rowSelection,
		onRowSelectionChange,
		getRowId,
		enableColumnResizing,
		columnSizing,
		onColumnSizingChange,
		columnVisibility,
		onColumnVisibilityChange,
		columnPinning,
		onColumnPinningChange,
		renderExpandedRow,
		globalFilter,
	});

	const hasFixedSizes = columns.some(
		(column) => typeof column.size === "number",
	);
	const rows = table.getRowModel().rows;

	return (
		<div data-slot="data-table" className={className}>
			{toolbar !== undefined && (
				<div className="pb-3">
					{typeof toolbar === "function" ? toolbar(table) : toolbar}
				</div>
			)}
			<DataTableMobileCardList
				rows={rows}
				loading={loading}
				emptyState={emptyState}
				onRowClick={onRowClick}
				renderMobileCard={renderMobileCard}
			/>
			<DataTableDesktopTable
				headerGroups={table.getHeaderGroups()}
				rows={rows}
				columnCount={table.getVisibleLeafColumns().length}
				loading={loading}
				emptyState={emptyState}
				onRowClick={onRowClick}
				stickyHeader={stickyHeader}
				containerClassName={containerClassName}
				hasFixedSizes={hasFixedSizes}
				hiddenOnMobile={renderMobileCard !== undefined}
				resizable={enableColumnResizing}
				renderExpandedRow={renderExpandedRow}
				density={density}
				table={table}
				pinned={
					(columnPinning?.left?.length ?? 0) +
						(columnPinning?.right?.length ?? 0) >
					0
				}
			/>
			{pagination !== undefined && <DataTablePagination {...pagination} />}
		</div>
	);
}

export {
	DataTable,
	DataTableActions,
	DataTableDensityToggle,
	DataTableEmpty,
	DataTableExport,
	DataTableFilters,
	DataTablePagination,
	DataTableSearch,
	DataTableToolbar,
	DataTableViewOptions,
	dataTableSelectionColumn,
	dataTableToCsv,
};
