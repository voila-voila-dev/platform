import * as React from "react";

/**
 * Internal hook for Spreadsheet's opt-in spreadsheet keyboard layer: grid
 * navigation, rectangular selection and TSV copy/paste. Not part of the
 * public kit surface - enable it through `gridNavigation` on `Spreadsheet`.
 *
 * The grid has two modes, told apart by where DOM focus sits:
 * - navigation: focus is on a `<td>` itself (roving tabindex, arrow keys move
 *   around, Shift+arrows select, Cmd/Ctrl+C copies);
 * - edit: focus is inside the cell, on the control (Escape returns to
 *   navigation, Enter commits and moves down, Tab moves to the next cell).
 *
 * Rather than keeping a React registry of rows and cells, the hook reads the
 * grid straight from the DOM on every interaction and re-stamps the
 * aria/tabindex attributes in an after-every-render effect: the parts stay
 * uncontrolled and consumer re-renders (added rows, reordered columns) are
 * picked up for free. Under `SpreadsheetVirtualRows` the mounted rows carry
 * their absolute `data-index`, positions stay absolute (row indexes over the
 * FULL set) and a MutationObserver re-stamps the rows that scrolling mounts
 * without any root re-render.
 */

const PAGE_FALLBACK_ROW_COUNT = 10;

interface SpreadsheetGridPosition {
	row: number;
	column: number;
}

interface SpreadsheetGridSelection {
	anchor: SpreadsheetGridPosition;
	focus: SpreadsheetGridPosition;
}

/** Rectangle covered by a selection, inclusive on every edge. */
interface SpreadsheetGridRect {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

interface SpreadsheetPasteData {
	/** 0-based grid position of the paste target's top-left cell. */
	startRow: number;
	startColumn: number;
	/** Parsed TSV matrix, one entry per pasted row. */
	values: string[][];
}

function getDataRows(table: HTMLTableElement) {
	return Array.from(
		table.querySelectorAll<HTMLTableRowElement>(
			":scope > tbody > tr[data-slot=spreadsheet-row]",
		),
	);
}

interface SpreadsheetGridRowEntry {
	row: HTMLTableRowElement;
	/** Absolute row index: virtualized `data-index` when present, DOM order otherwise. */
	index: number;
}

function getRowEntries(table: HTMLTableElement): SpreadsheetGridRowEntry[] {
	return getDataRows(table).map((row, positional) => {
		const declared = row.getAttribute("data-index");
		return { row, index: declared === null ? positional : Number(declared) };
	});
}

function getRowByIndex(table: HTMLTableElement, rowIndex: number) {
	return (
		getRowEntries(table).find((entry) => entry.index === rowIndex)?.row ?? null
	);
}

function getCellAt(table: HTMLTableElement, position: SpreadsheetGridPosition) {
	const row = getRowByIndex(table, position.row);
	return row === null ? null : row.cells.item(position.column);
}

function findCellPosition(
	table: HTMLTableElement,
	cell: HTMLTableCellElement,
): SpreadsheetGridPosition | null {
	const row = cell.parentElement;
	if (!(row instanceof HTMLTableRowElement)) {
		return null;
	}
	const entry = getRowEntries(table).find((candidate) => candidate.row === row);
	if (entry === undefined) {
		return null;
	}
	const columnIndex = Array.from(row.cells).indexOf(cell);
	return columnIndex === -1 ? null : { row: entry.index, column: columnIndex };
}

/**
 * Clamps to the full grid (virtual rows included), then to the mounted
 * window: a jump beyond what's rendered lands on the closest mounted row.
 */
function clampPosition(
	table: HTMLTableElement,
	position: SpreadsheetGridPosition,
	virtualRowCount: number | null,
): SpreadsheetGridPosition | null {
	const entries = getRowEntries(table);
	const first = entries[0];
	const last = entries.at(-1);
	if (first === undefined || last === undefined) {
		return null;
	}
	const totalRows = virtualRowCount ?? entries.length;
	const wanted = Math.min(totalRows - 1, Math.max(0, position.row));
	const entry =
		entries.find((candidate) => candidate.index === wanted) ??
		(wanted < first.index ? first : last);
	const columnCount = entry.row.cells.length;
	if (columnCount === 0) {
		return null;
	}
	return {
		row: entry.index,
		column: Math.min(columnCount - 1, Math.max(0, position.column)),
	};
}

function samePosition(
	left: SpreadsheetGridPosition,
	right: SpreadsheetGridPosition,
) {
	return left.row === right.row && left.column === right.column;
}

function toGridRect(
	anchor: SpreadsheetGridPosition,
	focus: SpreadsheetGridPosition,
): SpreadsheetGridRect {
	return {
		top: Math.min(anchor.row, focus.row),
		bottom: Math.max(anchor.row, focus.row),
		left: Math.min(anchor.column, focus.column),
		right: Math.max(anchor.column, focus.column),
	};
}

function isInsideRect(
	position: SpreadsheetGridPosition,
	rect: SpreadsheetGridRect,
) {
	return (
		position.row >= rect.top &&
		position.row <= rect.bottom &&
		position.column >= rect.left &&
		position.column <= rect.right
	);
}

/**
 * Copy value of one cell: the `value` declared on `SpreadsheetCell` wins,
 * then the inner control's live value, then the cell text (covers
 * `SpreadsheetCellText`).
 */
function getCellCopyValue(cell: HTMLTableCellElement) {
	const declared = cell.getAttribute("data-grid-value");
	if (declared !== null) {
		return declared;
	}
	const control = cell.querySelector<
		HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
	>("input, select, textarea");
	if (control !== null) {
		return control.value;
	}
	return cell.textContent?.trim() ?? "";
}

function serializeRectToTsv(
	table: HTMLTableElement,
	rect: SpreadsheetGridRect,
) {
	const rowsByIndex = new Map(
		getRowEntries(table).map((entry) => [entry.index, entry.row]),
	);
	const lines: string[] = [];
	for (let row = rect.top; row <= rect.bottom; row += 1) {
		const cells = Array.from(rowsByIndex.get(row)?.cells ?? []);
		const line: string[] = [];
		for (let column = rect.left; column <= rect.right; column += 1) {
			const cell = cells[column];
			line.push(cell === undefined ? "" : getCellCopyValue(cell));
		}
		lines.push(line.join("\t"));
	}
	return lines.join("\n");
}

function parseTsvText(text: string): string[][] {
	const lines = text.replace(/\r\n?/g, "\n").split("\n");
	// Spreadsheets terminate the payload with a newline; that's not a row.
	if (lines.at(-1) === "") {
		lines.pop();
	}
	return lines.map((line) => line.split("\t"));
}

const ARROW_DELTAS: Record<string, SpreadsheetGridPosition> = {
	ArrowUp: { row: -1, column: 0 },
	ArrowDown: { row: 1, column: 0 },
	ArrowLeft: { row: 0, column: -1 },
	ArrowRight: { row: 0, column: 1 },
};

/**
 * Home/End move within the row; with Cmd/Ctrl they jump to the grid's
 * corners. Out-of-range coordinates are clamped by the caller.
 */
function resolveHomeEndTarget(
	position: SpreadsheetGridPosition,
	event: React.KeyboardEvent,
): SpreadsheetGridPosition {
	const toStart = event.key === "Home";
	const jumpRows = event.ctrlKey || event.metaKey;
	const edgeRow = toStart ? 0 : Number.MAX_SAFE_INTEGER;
	return {
		row: jumpRows ? edgeRow : position.row,
		column: toStart ? 0 : Number.MAX_SAFE_INTEGER,
	};
}

/**
 * Maps a navigation-mode keydown to the (unclamped) target position, or null
 * when the key doesn't navigate.
 */
function resolveMoveTarget(
	position: SpreadsheetGridPosition,
	event: React.KeyboardEvent,
	pageRowCount: number,
): SpreadsheetGridPosition | null {
	const arrow = ARROW_DELTAS[event.key];
	if (arrow !== undefined) {
		return {
			row: position.row + arrow.row,
			column: position.column + arrow.column,
		};
	}
	if (event.key === "PageUp" || event.key === "PageDown") {
		const step = event.key === "PageUp" ? -pageRowCount : pageRowCount;
		return { row: position.row + step, column: position.column };
	}
	if (event.key === "Home" || event.key === "End") {
		return resolveHomeEndTarget(position, event);
	}
	return null;
}

function getPageRowCount(table: HTMLTableElement) {
	const container = table.closest<HTMLElement>(
		"[data-slot=spreadsheet-container]",
	);
	const rowHeight = getDataRows(table)[0]?.getBoundingClientRect().height ?? 0;
	if (container === null || rowHeight === 0) {
		return PAGE_FALLBACK_ROW_COUNT;
	}
	return Math.max(1, Math.floor(container.clientHeight / rowHeight));
}

function isPrintableKey(event: React.KeyboardEvent) {
	return (
		event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey
	);
}

function isCopyShortcut(event: React.KeyboardEvent) {
	return (
		(event.metaKey || event.ctrlKey) &&
		!event.shiftKey &&
		!event.altKey &&
		event.key.toLowerCase() === "c"
	);
}

/**
 * Focuses the cell's control, selecting a text control's content so typing
 * replaces it like a spreadsheet type-over. False when the cell has nothing
 * to edit (e.g. a text cell).
 */
function enterEditMode(cell: HTMLTableCellElement) {
	const control = cell.querySelector<HTMLElement>(
		"input, select, textarea, button, a[href], [tabindex]",
	);
	if (control === null) {
		return false;
	}
	control.focus();
	if (
		control instanceof HTMLInputElement ||
		control instanceof HTMLTextAreaElement
	) {
		control.select();
	}
	return true;
}

function stampColumnIndexes(row: HTMLTableRowElement) {
	for (const [index, cell] of Array.from(row.cells).entries()) {
		cell.setAttribute("aria-colindex", String(index + 1));
	}
}

/** In grid mode the cells are the single tab stop: controls leave tab order. */
function stampCellControls(cell: HTMLTableCellElement) {
	for (const control of cell.querySelectorAll<HTMLElement>(
		"input, select, textarea, button, a[href]",
	)) {
		control.setAttribute("tabindex", "-1");
	}
}

/**
 * Edge flags let CSS draw one border around the whole range instead of a
 * ring per cell; `rect` is null for unselected cells, dropping every flag.
 */
function stampSelectionEdges(
	cell: HTMLTableCellElement,
	position: SpreadsheetGridPosition,
	rect: SpreadsheetGridRect | null,
) {
	cell.toggleAttribute("data-grid-edge-top", rect?.top === position.row);
	cell.toggleAttribute("data-grid-edge-bottom", rect?.bottom === position.row);
	cell.toggleAttribute("data-grid-edge-left", rect?.left === position.column);
	cell.toggleAttribute("data-grid-edge-right", rect?.right === position.column);
}

function stampBodyCell(
	cell: HTMLTableCellElement,
	position: SpreadsheetGridPosition,
	active: SpreadsheetGridPosition | null,
	rect: SpreadsheetGridRect | null,
) {
	cell.setAttribute("aria-colindex", String(position.column + 1));
	const isActive = active !== null && samePosition(active, position);
	cell.setAttribute("tabindex", isActive ? "0" : "-1");
	const selected = rect !== null && isInsideRect(position, rect);
	cell.setAttribute("aria-selected", selected ? "true" : "false");
	cell.toggleAttribute("data-grid-selected", selected);
	stampSelectionEdges(cell, position, selected ? rect : null);
	stampCellControls(cell);
}

function stampGridAttributes(
	table: HTMLTableElement,
	activePosition: SpreadsheetGridPosition | null,
	selection: SpreadsheetGridSelection | null,
	virtualRowCount: number | null,
) {
	const headerRows = Array.from(
		table.querySelectorAll<HTMLTableRowElement>(":scope > thead > tr"),
	);
	const entries = getRowEntries(table);
	const columnCount = Math.max(
		headerRows[0]?.cells.length ?? 0,
		entries[0]?.row.cells.length ?? 0,
	);
	const totalRows = virtualRowCount ?? entries.length;
	table.setAttribute("aria-rowcount", String(headerRows.length + totalRows));
	table.setAttribute("aria-colcount", String(columnCount));
	for (const [index, headerRow] of headerRows.entries()) {
		headerRow.setAttribute("aria-rowindex", String(index + 1));
		stampColumnIndexes(headerRow);
	}
	const active = clampPosition(
		table,
		activePosition ?? { row: 0, column: 0 },
		virtualRowCount,
	);
	const rect =
		selection === null ? null : toGridRect(selection.anchor, selection.focus);
	for (const entry of entries) {
		entry.row.setAttribute(
			"aria-rowindex",
			String(headerRows.length + entry.index + 1),
		);
		for (const [columnIndex, cell] of Array.from(entry.row.cells).entries()) {
			stampBodyCell(
				cell,
				{ row: entry.index, column: columnIndex },
				active,
				rect,
			);
		}
	}
}

interface SpreadsheetGridTableProps {
	role?: "grid";
	"aria-multiselectable"?: boolean;
	onFocus?: React.FocusEventHandler<HTMLTableElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLTableElement>;
	onPaste?: React.ClipboardEventHandler<HTMLTableElement>;
	onPointerDown?: React.PointerEventHandler<HTMLTableElement>;
	onPointerMove?: React.PointerEventHandler<HTMLTableElement>;
}

function useSpreadsheetGrid({
	enabled,
	onPasteData,
	virtualRowCount,
}: {
	enabled: boolean;
	onPasteData: ((data: SpreadsheetPasteData) => void) | undefined;
	/** Total row count under SpreadsheetVirtualRows, null otherwise. */
	virtualRowCount: number | null;
}): {
	tableRef: React.RefObject<HTMLTableElement | null>;
	tableProps: SpreadsheetGridTableProps;
} {
	const tableRef = React.useRef<HTMLTableElement | null>(null);
	const [activePosition, setActivePosition] =
		React.useState<SpreadsheetGridPosition | null>(null);
	const [selection, setSelection] =
		React.useState<SpreadsheetGridSelection | null>(null);
	const dragState = React.useRef<{
		pointerId: number;
		anchor: SpreadsheetGridPosition;
		dragging: boolean;
	} | null>(null);

	// Re-stamp after EVERY render: consumer re-renders (added rows, reordered
	// columns) flow through the root, so the DOM attributes stay in sync
	// without a cell registry. Virtualized scrolling mounts rows WITHOUT a
	// root re-render, so a MutationObserver covers those until the next one
	// (childList only - stamping mutates attributes, never nodes, no loop).
	React.useEffect(() => {
		const table = tableRef.current;
		if (!enabled || table === null) {
			return;
		}
		stampGridAttributes(table, activePosition, selection, virtualRowCount);
		const observer = new MutationObserver(() => {
			stampGridAttributes(table, activePosition, selection, virtualRowCount);
		});
		observer.observe(table, { childList: true, subtree: true });
		return () => observer.disconnect();
	});

	const moveFocus = (
		table: HTMLTableElement,
		target: SpreadsheetGridPosition,
		extend: boolean,
		from: SpreadsheetGridPosition,
	) => {
		const clamped = clampPosition(table, target, virtualRowCount);
		if (clamped === null) {
			return;
		}
		getCellAt(table, clamped)?.focus();
		setActivePosition(clamped);
		if (extend) {
			setSelection((current) => ({
				anchor: current?.anchor ?? from,
				focus: clamped,
			}));
		} else {
			setSelection(null);
		}
	};

	const copyRange = (
		table: HTMLTableElement,
		position: SpreadsheetGridPosition,
	) => {
		const rect =
			selection === null
				? toGridRect(position, position)
				: toGridRect(selection.anchor, selection.focus);
		navigator.clipboard
			?.writeText(serializeRectToTsv(table, rect))
			.catch(() => {
				// Clipboard access can be denied; copying stays best-effort.
			});
	};

	const startEditing = (
		event: React.KeyboardEvent<HTMLTableElement>,
		cell: HTMLTableCellElement,
	) => {
		if (!enterEditMode(cell)) {
			return;
		}
		// Enter/F2 must not leak into the control, while a printable key must
		// land in it (it replaces the just-selected content).
		if (!isPrintableKey(event)) {
			event.preventDefault();
		}
		setSelection(null);
	};

	const clearSelection = (event: React.KeyboardEvent<HTMLTableElement>) => {
		if (selection === null) {
			return;
		}
		event.preventDefault();
		// A dialog hosting the grid must not close on the Escape that only
		// dropped the selection.
		event.stopPropagation();
		setSelection(null);
	};

	const handleNavigationKey = (
		event: React.KeyboardEvent<HTMLTableElement>,
		table: HTMLTableElement,
		cell: HTMLTableCellElement,
		position: SpreadsheetGridPosition,
	) => {
		if (isCopyShortcut(event)) {
			event.preventDefault();
			copyRange(table, position);
			return;
		}
		if (event.key === "Escape") {
			clearSelection(event);
			return;
		}
		if (event.key === "Enter" || event.key === "F2" || isPrintableKey(event)) {
			startEditing(event, cell);
			return;
		}
		const target = resolveMoveTarget(position, event, getPageRowCount(table));
		if (target !== null) {
			event.preventDefault();
			moveFocus(table, target, event.shiftKey, position);
		}
	};

	const moveEditTab = (
		event: React.KeyboardEvent<HTMLTableElement>,
		table: HTMLTableElement,
		position: SpreadsheetGridPosition,
	) => {
		const columnCount = getRowByIndex(table, position.row)?.cells.length ?? 0;
		if (columnCount === 0) {
			return;
		}
		const totalRows = virtualRowCount ?? getDataRows(table).length;
		const linear =
			position.row * columnCount + position.column + (event.shiftKey ? -1 : 1);
		if (linear < 0 || linear >= totalRows * columnCount) {
			return; // Grid boundary: let Tab leave the grid.
		}
		event.preventDefault();
		moveFocus(
			table,
			{ row: Math.floor(linear / columnCount), column: linear % columnCount },
			false,
			position,
		);
	};

	const handleEditKey = (
		event: React.KeyboardEvent<HTMLTableElement>,
		table: HTMLTableElement,
		target: HTMLElement,
		position: SpreadsheetGridPosition,
	) => {
		if (event.defaultPrevented) {
			return; // e.g. Escape already consumed by a grabbed row-drag handle.
		}
		if (event.key === "Escape") {
			event.preventDefault();
			event.stopPropagation();
			getCellAt(table, position)?.focus();
			return;
		}
		// Enter commits and moves down - but only from text inputs: buttons,
		// selects and textareas keep their native Enter behavior.
		if (event.key === "Enter" && target instanceof HTMLInputElement) {
			event.preventDefault();
			moveFocus(
				table,
				{ row: position.row + 1, column: position.column },
				false,
				position,
			);
			return;
		}
		if (event.key === "Tab") {
			moveEditTab(event, table, position);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTableElement>) => {
		const table = tableRef.current;
		const targetElement = event.target as HTMLElement;
		const cell = targetElement.closest("td");
		if (table === null || cell === null) {
			return;
		}
		const position = findCellPosition(table, cell);
		if (position === null) {
			return;
		}
		if (targetElement === cell) {
			handleNavigationKey(event, table, cell, position);
		} else {
			handleEditKey(event, table, targetElement, position);
		}
	};

	const handleFocus = (event: React.FocusEvent<HTMLTableElement>) => {
		const table = tableRef.current;
		const cell = (event.target as HTMLElement).closest("td");
		if (table === null || cell === null) {
			return;
		}
		const position = findCellPosition(table, cell);
		if (position === null) {
			return;
		}
		setActivePosition((current) =>
			current !== null && samePosition(current, position) ? current : position,
		);
	};

	const handlePaste = (event: React.ClipboardEvent<HTMLTableElement>) => {
		const table = tableRef.current;
		const targetElement = event.target as HTMLElement;
		const cell = targetElement.closest("td");
		if (table === null || onPasteData === undefined || cell === null) {
			return;
		}
		if (targetElement !== cell) {
			return; // Edit mode: the control receives the paste natively.
		}
		const position = findCellPosition(table, cell);
		if (position === null) {
			return;
		}
		const values = parseTsvText(event.clipboardData.getData("text/plain"));
		if (values.length === 0) {
			return;
		}
		event.preventDefault();
		const rect =
			selection === null
				? toGridRect(position, position)
				: toGridRect(selection.anchor, selection.focus);
		onPasteData({ startRow: rect.top, startColumn: rect.left, values });
	};

	const endPointerSelection = () => {
		dragState.current = null;
	};

	const handlePointerDown = (event: React.PointerEvent<HTMLTableElement>) => {
		const table = tableRef.current;
		const targetElement = event.target as HTMLElement;
		if (
			table === null ||
			event.button !== 0 ||
			targetElement.closest("button, a, input, select, textarea, label") !==
				null
		) {
			return;
		}
		const cell = targetElement.closest("td");
		if (cell === null) {
			return;
		}
		const position = findCellPosition(table, cell);
		if (position === null) {
			return;
		}
		// Take over the native mousedown: no text selection, focus lands on the
		// cell itself (navigation mode) and dragging extends the selection.
		event.preventDefault();
		cell.focus();
		if (event.shiftKey) {
			const anchor = activePosition ?? position;
			setSelection((current) => ({
				anchor: current?.anchor ?? anchor,
				focus: position,
			}));
			return;
		}
		setSelection(null);
		dragState.current = {
			pointerId: event.pointerId,
			anchor: position,
			dragging: false,
		};
		// The drag can end anywhere on the page, not just above the table.
		window.addEventListener("pointerup", endPointerSelection, { once: true });
		window.addEventListener("pointercancel", endPointerSelection, {
			once: true,
		});
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLTableElement>) => {
		const state = dragState.current;
		const table = tableRef.current;
		if (
			state === null ||
			table === null ||
			state.pointerId !== event.pointerId
		) {
			return;
		}
		const cell = (event.target as HTMLElement).closest("td");
		if (cell === null) {
			return;
		}
		const position = findCellPosition(table, cell);
		if (position === null) {
			return;
		}
		if (!state.dragging && samePosition(position, state.anchor)) {
			return;
		}
		state.dragging = true;
		setSelection({ anchor: state.anchor, focus: position });
	};

	if (!enabled) {
		return { tableRef, tableProps: {} };
	}
	return {
		tableRef,
		tableProps: {
			role: "grid",
			"aria-multiselectable": true,
			onFocus: handleFocus,
			onKeyDown: handleKeyDown,
			onPaste: handlePaste,
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
		},
	};
}

export { type SpreadsheetPasteData, useSpreadsheetGrid };
