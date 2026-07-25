import * as React from "react";

/**
 * Internal hooks for Spreadsheet's pointer/keyboard interactions (column
 * resize, column reorder, row drag). Not part of the public kit surface -
 * import the parts from `#/components/ui/spreadsheet.tsx` instead.
 */

const DRAG_THRESHOLD_PX = 4;
const MIN_COLUMN_WIDTH_PX = 48;
const KEYBOARD_RESIZE_STEP_PX = 16;
const ROW_DRAG_LONG_PRESS_MS = 300;
const LONG_PRESS_MOVE_TOLERANCE_PX = 10;

/**
 * Drop indicator drawn by the Spreadsheet root, absolutely positioned
 * inside the scroll container in content coordinates (so it scrolls with the
 * table).
 */
interface SpreadsheetDropLine {
	left: number;
	top: number;
	width: number;
	height: number;
}

function getScrollContainer(element: HTMLElement) {
	return element.closest<HTMLElement>("[data-slot=spreadsheet-container]");
}

/**
 * Synthetic pointer events (tests, Storybook play functions) have no active
 * pointer to capture and make `setPointerCapture` throw NotFoundError; the
 * drag must survive that - it still works while the pointer stays over the
 * element.
 */
function capturePointer(element: Element, pointerId: number) {
	try {
		element.setPointerCapture(pointerId);
	} catch {
		// No active pointer: keep going uncaptured.
	}
}

/** Converts a viewport rect into the scroll container's content coordinates. */
function toContentRect(container: HTMLElement, rect: DOMRect) {
	const containerRect = container.getBoundingClientRect();
	return {
		left: rect.left - containerRect.left + container.scrollLeft,
		top: rect.top - containerRect.top + container.scrollTop,
		width: rect.width,
		height: rect.height,
	};
}

function getBodyRows(element: HTMLElement) {
	const body = element.closest("tbody");
	return body
		? Array.from(
				body.querySelectorAll<HTMLElement>("tr[data-slot=spreadsheet-row]"),
			)
		: [];
}

/**
 * Insertion target for a dragged column. `heads` are the reorderable header
 * cells in DOM order (which matches `columnOrder`: the consumer renders
 * columns from it); the returned `targetIndex` is the column's final position
 * and `edgeX` the viewport x of the insertion edge.
 */
function computeColumnDropTarget(
	heads: HTMLElement[],
	draggedHead: HTMLElement,
	clientX: number,
) {
	let slot = heads.length;
	for (const [index, candidate] of heads.entries()) {
		const rect = candidate.getBoundingClientRect();
		if (clientX < rect.left + rect.width / 2) {
			slot = index;
			break;
		}
	}
	const edgeHead = slot < heads.length ? heads[slot] : heads.at(-1);
	if (edgeHead === undefined) {
		return null;
	}
	const edgeRect = edgeHead.getBoundingClientRect();
	const fromIndex = heads.indexOf(draggedHead);
	return {
		targetIndex: slot > fromIndex ? slot - 1 : slot,
		edgeX: slot < heads.length ? edgeRect.left : edgeRect.right,
	};
}

/** Maps a keydown on a row drag handle to its action, if any. */
function resolveRowDragKey(key: string, grabbed: boolean) {
	if (key === " ") {
		return "toggle" as const;
	}
	if (!grabbed) {
		return null;
	}
	if (key === "Escape") {
		return "cancel" as const;
	}
	if (key === "ArrowUp") {
		return "up" as const;
	}
	return key === "ArrowDown" ? ("down" as const) : null;
}

/**
 * Insertion target for a dragged row, among the rows WITHOUT the dragged one
 * (so the returned index is directly the row's final position).
 */
function computeRowDropTarget(otherRows: HTMLElement[], clientY: number) {
	for (const [candidate, row] of otherRows.entries()) {
		const rect = row.getBoundingClientRect();
		if (clientY < rect.top + rect.height / 2) {
			return candidate;
		}
	}
	return otherRows.length;
}

/**
 * Pointer + keyboard resizing for one column's resize handle. The handle's
 * `<th>` is measured lazily (on focus or drag start) so unresized columns
 * keep flowing with `table-layout: auto` until the first interaction.
 */
function useSpreadsheetColumnResize({
	width,
	onWidthChange,
}: {
	width: number | undefined;
	onWidthChange: (width: number) => void;
}) {
	const dragState = React.useRef<{
		pointerId: number;
		startX: number;
		startWidth: number;
	} | null>(null);
	const [measuredWidth, setMeasuredWidth] = React.useState<number>();
	const currentWidth = width ?? measuredWidth;

	const measure = (handle: HTMLElement) => {
		const head = handle.closest("th");
		return head ? head.getBoundingClientRect().width : MIN_COLUMN_WIDTH_PX;
	};

	return {
		"aria-valuemin": MIN_COLUMN_WIDTH_PX,
		"aria-valuenow":
			currentWidth === undefined ? undefined : Math.round(currentWidth),
		onFocus: (event: React.FocusEvent<HTMLElement>) => {
			setMeasuredWidth(measure(event.currentTarget));
		},
		onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
			if (event.button !== 0) {
				return;
			}
			// No text selection or click-through while dragging the handle.
			event.preventDefault();
			event.stopPropagation();
			const startWidth = width ?? measure(event.currentTarget);
			setMeasuredWidth(startWidth);
			dragState.current = {
				pointerId: event.pointerId,
				startX: event.clientX,
				startWidth,
			};
			capturePointer(event.currentTarget, event.pointerId);
		},
		onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
			const state = dragState.current;
			if (state === null || state.pointerId !== event.pointerId) {
				return;
			}
			onWidthChange(
				Math.max(
					MIN_COLUMN_WIDTH_PX,
					state.startWidth + event.clientX - state.startX,
				),
			);
		},
		onPointerUp: () => {
			dragState.current = null;
		},
		onPointerCancel: () => {
			dragState.current = null;
		},
		onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
			// Alt+arrows bubble up to the th for column reordering.
			if (
				event.altKey ||
				(event.key !== "ArrowLeft" && event.key !== "ArrowRight")
			) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			const base = width ?? measure(event.currentTarget);
			const delta =
				event.key === "ArrowLeft"
					? -KEYBOARD_RESIZE_STEP_PX
					: KEYBOARD_RESIZE_STEP_PX;
			const next = Math.max(MIN_COLUMN_WIDTH_PX, base + delta);
			setMeasuredWidth(next);
			onWidthChange(next);
		},
	};
}

/**
 * Pointer drag + Alt+arrow reordering for a header cell. Only active when the
 * table received controlled `columnOrder`/`onColumnOrderChange`; the hook
 * never reorders anything itself, it hands the next order to the consumer.
 * Pointer drags starting on interactive content (sort button, resize handle)
 * are left alone, so a sortable column stays reorderable by keyboard only.
 */
function useSpreadsheetColumnReorder({
	columnId,
	columnOrder,
	onColumnOrderChange,
	setDropLine,
	announce,
}: {
	columnId: string | undefined;
	columnOrder: readonly string[] | undefined;
	onColumnOrderChange: ((order: string[]) => void) | undefined;
	setDropLine: (line: SpreadsheetDropLine | null) => void;
	announce: (message: string) => void;
}) {
	const dragState = React.useRef<{
		pointerId: number;
		startX: number;
		dragging: boolean;
		targetIndex: number | null;
	} | null>(null);

	if (
		columnId === undefined ||
		columnOrder === undefined ||
		onColumnOrderChange === undefined
	) {
		return { enabled: false as const, headProps: {} };
	}

	const moveColumn = (toIndex: number) => {
		const fromIndex = columnOrder.indexOf(columnId);
		if (
			fromIndex === -1 ||
			toIndex < 0 ||
			toIndex >= columnOrder.length ||
			toIndex === fromIndex
		) {
			return;
		}
		const next = [...columnOrder];
		next.splice(fromIndex, 1);
		next.splice(toIndex, 0, columnId);
		onColumnOrderChange(next);
		announce(`Column moved to position ${toIndex + 1} of ${next.length}.`);
	};

	return {
		enabled: true as const,
		headProps: {
			onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
				if (
					!event.altKey ||
					(event.key !== "ArrowLeft" && event.key !== "ArrowRight")
				) {
					return;
				}
				event.preventDefault();
				const fromIndex = columnOrder.indexOf(columnId);
				moveColumn(event.key === "ArrowLeft" ? fromIndex - 1 : fromIndex + 1);
			},
			onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
				if (
					event.button !== 0 ||
					(event.target as HTMLElement).closest("button, [role=separator]")
				) {
					return;
				}
				dragState.current = {
					pointerId: event.pointerId,
					startX: event.clientX,
					dragging: false,
					targetIndex: null,
				};
				capturePointer(event.currentTarget, event.pointerId);
			},
			onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
				const state = dragState.current;
				if (state === null || state.pointerId !== event.pointerId) {
					return;
				}
				if (
					!state.dragging &&
					Math.abs(event.clientX - state.startX) < DRAG_THRESHOLD_PX
				) {
					return;
				}
				state.dragging = true;
				const head = event.currentTarget;
				const container = getScrollContainer(head);
				const headerRow = head.parentElement;
				const table = container?.querySelector("table");
				if (!container || !headerRow || !table) {
					return;
				}
				const heads = Array.from(
					headerRow.querySelectorAll<HTMLElement>("th[data-column-id]"),
				);
				const drop = computeColumnDropTarget(heads, head, event.clientX);
				if (drop === null) {
					return;
				}
				state.targetIndex = drop.targetIndex;
				const tableRect = toContentRect(
					container,
					table.getBoundingClientRect(),
				);
				const containerRect = container.getBoundingClientRect();
				setDropLine({
					left: drop.edgeX - containerRect.left + container.scrollLeft - 1,
					top: tableRect.top,
					width: 2,
					height: tableRect.height,
				});
			},
			onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
				const state = dragState.current;
				if (state === null || state.pointerId !== event.pointerId) {
					return;
				}
				dragState.current = null;
				setDropLine(null);
				if (state.dragging && state.targetIndex !== null) {
					moveColumn(state.targetIndex);
				}
			},
			onPointerCancel: () => {
				dragState.current = null;
				setDropLine(null);
			},
		},
	};
}

/**
 * Recomputes the insertion point under the pointer and draws the drop line
 * (skipped when the geometry is unavailable). Returns the target index.
 */
function updateRowDropLine(
	handle: HTMLElement,
	rowIndex: number,
	clientY: number,
	setDropLine: (line: SpreadsheetDropLine | null) => void,
) {
	const others = getBodyRows(handle).filter(
		(_, candidate) => candidate !== rowIndex,
	);
	const targetIndex = computeRowDropTarget(others, clientY);
	const container = getScrollContainer(handle);
	const edgeRow = others[Math.min(targetIndex, others.length - 1)];
	if (!container || edgeRow === undefined) {
		return targetIndex;
	}
	const rect = toContentRect(container, edgeRow.getBoundingClientRect());
	const y = targetIndex >= others.length ? rect.top + rect.height : rect.top;
	setDropLine({ left: rect.left, top: y - 1, width: rect.width, height: 2 });
	return targetIndex;
}

/** The row ghosts along the y axis while dragged (or armed by long-press). */
function applyRowGhost(row: HTMLElement, offsetY: number) {
	row.style.transform = `translateY(${offsetY}px)`;
	row.style.position = "relative";
	row.style.zIndex = "1";
	row.style.backgroundColor = "var(--color-background)";
	row.setAttribute("data-dragging", "true");
}

/**
 * Pointer drag + keyboard grab for a row drag handle. Pointer: the row
 * ghosts along the y axis and a drop line marks the insertion point; a touch
 * pointer must long-press the handle first (a finger that wanders before the
 * delay is treated as an aborted press, never a drag). Keyboard: Space grabs,
 * ArrowUp/ArrowDown pick the target position, Space drops, Escape cancels;
 * every step is announced through the table's `aria-live` region. Both paths
 * end in a single `onRowMove(from, to)` - the consumer applies the move to
 * its own array.
 */
function useSpreadsheetRowDrag({
	index,
	onRowMove,
	setDropLine,
	announce,
}: {
	index: number;
	onRowMove: ((fromIndex: number, toIndex: number) => void) | undefined;
	setDropLine: (line: SpreadsheetDropLine | null) => void;
	announce: (message: string) => void;
}) {
	// Keyboard grab: the pending target position, or null when not grabbed.
	const [keyboardTarget, setKeyboardTarget] = React.useState<number | null>(
		null,
	);
	const dragState = React.useRef<{
		pointerId: number;
		startY: number;
		row: HTMLElement;
		/** False until a touch long-press fires; mouse/pen arm immediately. */
		armed: boolean;
		longPressTimer: number | null;
		dragging: boolean;
		targetIndex: number | null;
	} | null>(null);

	const clearLongPressTimer = (state: { longPressTimer: number | null }) => {
		if (state.longPressTimer !== null) {
			window.clearTimeout(state.longPressTimer);
			state.longPressTimer = null;
		}
	};

	React.useEffect(() => {
		return () => {
			const state = dragState.current;
			if (state !== null) {
				clearLongPressTimer(state);
			}
		};
	}, []);

	const showLineAt = (handle: HTMLElement, targetIndex: number) => {
		const container = getScrollContainer(handle);
		const target = getBodyRows(handle)[targetIndex];
		if (!container || !target) {
			return;
		}
		const rect = toContentRect(container, target.getBoundingClientRect());
		const y = targetIndex > index ? rect.top + rect.height : rect.top;
		setDropLine({ left: rect.left, top: y - 1, width: rect.width, height: 2 });
	};

	const releaseRowGhost = (row: HTMLElement) => {
		row.style.transform = "";
		row.style.position = "";
		row.style.zIndex = "";
		row.style.backgroundColor = "";
		row.removeAttribute("data-dragging");
	};

	const grabOrDrop = () => {
		if (keyboardTarget === null) {
			setKeyboardTarget(index);
			announce(
				`Row ${index + 1} grabbed. Press the arrow keys to move it, space to drop, escape to cancel.`,
			);
			return;
		}
		setKeyboardTarget(null);
		setDropLine(null);
		if (keyboardTarget !== index) {
			onRowMove?.(index, keyboardTarget);
		}
		announce(`Row dropped at position ${keyboardTarget + 1}.`);
	};

	const moveKeyboardTarget = (handle: HTMLElement, step: -1 | 1) => {
		if (keyboardTarget === null) {
			return;
		}
		const rowCount = getBodyRows(handle).length;
		const next = Math.min(rowCount - 1, Math.max(0, keyboardTarget + step));
		setKeyboardTarget(next);
		showLineAt(handle, next);
		announce(`Move row to position ${next + 1} of ${rowCount}.`);
	};

	const cancelKeyboardMove = () => {
		if (keyboardTarget === null) {
			return;
		}
		setKeyboardTarget(null);
		setDropLine(null);
		announce("Row move cancelled.");
	};

	return {
		"data-grabbed": keyboardTarget === null ? undefined : true,
		onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
			if (onRowMove === undefined) {
				return;
			}
			const action = resolveRowDragKey(event.key, keyboardTarget !== null);
			if (action === null) {
				return;
			}
			event.preventDefault();
			if (action === "toggle") {
				grabOrDrop();
			} else if (action === "cancel") {
				cancelKeyboardMove();
			} else {
				moveKeyboardTarget(event.currentTarget, action === "down" ? 1 : -1);
			}
		},
		onBlur: () => {
			if (keyboardTarget !== null) {
				setKeyboardTarget(null);
				setDropLine(null);
			}
		},
		onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
			// dragState non-null = a second concurrent pointer (multi-touch); it
			// must not hijack the drag in flight.
			if (
				event.button !== 0 ||
				onRowMove === undefined ||
				dragState.current !== null
			) {
				return;
			}
			const row = event.currentTarget.closest("tr");
			if (!row) {
				return;
			}
			event.preventDefault();
			const state = {
				pointerId: event.pointerId,
				startY: event.clientY,
				row,
				armed: event.pointerType !== "touch",
				longPressTimer: null as number | null,
				dragging: false,
				targetIndex: null,
			};
			if (!state.armed) {
				state.longPressTimer = window.setTimeout(() => {
					state.longPressTimer = null;
					state.armed = true;
					// Grab cue: the row lifts in place until the finger moves.
					applyRowGhost(state.row, 0);
				}, ROW_DRAG_LONG_PRESS_MS);
			}
			dragState.current = state;
			capturePointer(event.currentTarget, event.pointerId);
		},
		onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
			const state = dragState.current;
			if (state === null || state.pointerId !== event.pointerId) {
				return;
			}
			const offsetY = event.clientY - state.startY;
			if (!state.armed) {
				if (Math.abs(offsetY) > LONG_PRESS_MOVE_TOLERANCE_PX) {
					clearLongPressTimer(state);
					dragState.current = null;
				}
				return;
			}
			if (!state.dragging && Math.abs(offsetY) < DRAG_THRESHOLD_PX) {
				return;
			}
			state.dragging = true;
			// Ghost the real row: cheap, keeps cell widths, and the transform is
			// wiped on drop before the consumer re-renders the new order.
			applyRowGhost(state.row, offsetY);
			state.targetIndex = updateRowDropLine(
				event.currentTarget,
				index,
				event.clientY,
				setDropLine,
			);
		},
		onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
			const state = dragState.current;
			if (state === null || state.pointerId !== event.pointerId) {
				return;
			}
			clearLongPressTimer(state);
			dragState.current = null;
			releaseRowGhost(state.row);
			setDropLine(null);
			if (
				state.dragging &&
				state.targetIndex !== null &&
				state.targetIndex !== index
			) {
				onRowMove?.(index, state.targetIndex);
			}
		},
		onPointerCancel: () => {
			const state = dragState.current;
			if (state === null) {
				return;
			}
			clearLongPressTimer(state);
			dragState.current = null;
			releaseRowGhost(state.row);
			setDropLine(null);
		},
	};
}

export {
	type SpreadsheetDropLine,
	useSpreadsheetColumnReorder,
	useSpreadsheetColumnResize,
	useSpreadsheetRowDrag,
};
