import * as React from "react";

/** Widths outside this range are dropped as corrupt when read back. */
const MINIMUM_WIDTH = 32;
const MAXIMUM_WIDTH = 1200;

/** A width worth restoring: finite and inside the range a column can live at. */
function isPlausibleWidth(width: unknown): width is number {
	return (
		typeof width === "number" &&
		Number.isFinite(width) &&
		width >= MINIMUM_WIDTH &&
		width <= MAXIMUM_WIDTH
	);
}

/** The stored entry as a plain object, or null when it is absent or corrupt. */
function readStoredEntry(raw: string | null): Record<string, unknown> | null {
	if (raw === null) {
		return null;
	}
	try {
		const parsed: unknown = JSON.parse(raw);
		const isObject =
			typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
		return isObject ? (parsed as Record<string, unknown>) : null;
	} catch {
		return null; // Corrupt entry: fall back to the defaults rather than throw.
	}
}

/**
 * Parses a persisted sizing map, keeping only entries that are still plausible:
 * a finite width in range, under a column id the table still declares. Stored
 * widths outlive the code that wrote them - a renamed or dropped column, a
 * hand-edited entry, or a half-written value must not be able to wedge a table
 * at 4px wide with no way back but clearing site data.
 */
function parseStoredSizing(
	raw: string | null,
	columnIds: ReadonlySet<string>,
): Record<string, number> {
	const entry = readStoredEntry(raw);
	if (entry === null) {
		return {};
	}
	const sizing: Record<string, number> = {};
	for (const [columnId, width] of Object.entries(entry)) {
		if (columnIds.has(columnId) && isPlausibleWidth(width)) {
			sizing[columnId] = Math.round(width);
		}
	}
	return sizing;
}

/**
 * Column widths for an `Spreadsheet`, persisted per user in `localStorage`.
 * Returns the `columnSizing` / `onColumnSizingChange` pair to spread on the
 * table, plus `reset` for a "restore default widths" action.
 *
 * `columnIds` fences what may be read back (see `parseStoredSizing`), so pass
 * the table's declared ids. Only resized columns are stored - a column the user
 * never touched keeps following the `width` its `SpreadsheetColumn` declares,
 * which is what lets a later default-width change reach existing users.
 *
 * Read lazily on mount rather than during render: the app hydrates on the
 * server too, where `localStorage` does not exist, and a first paint at the
 * default widths beats one at zero.
 */
function useSpreadsheetColumnSizing({
	storageKey,
	columnIds,
}: {
	/** Stable, namespaced, e.g. "acme.dev.shop-variants.column-sizing". */
	storageKey: string;
	columnIds: readonly string[];
}): {
	columnSizing: Record<string, number>;
	onColumnSizingChange: (sizing: Record<string, number>) => void;
	reset: () => void;
} {
	const [columnSizing, setColumnSizing] = React.useState<
		Record<string, number>
	>({});
	// The ids are declared inline by the consumer, so a fresh array arrives on
	// every render; the joined key is what actually changes.
	const columnIdsKey = columnIds.join("|");

	React.useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		setColumnSizing(
			parseStoredSizing(
				window.localStorage.getItem(storageKey),
				new Set(columnIdsKey.split("|")),
			),
		);
	}, [storageKey, columnIdsKey]);

	const write = (sizing: Record<string, number>) => {
		setColumnSizing(sizing);
		if (typeof window === "undefined") {
			return;
		}
		try {
			window.localStorage.setItem(storageKey, JSON.stringify(sizing));
		} catch {
			// Private mode or a full quota: the widths still apply this session.
		}
	};

	return {
		columnSizing,
		onColumnSizingChange: write,
		reset: () => write({}),
	};
}

export { useSpreadsheetColumnSizing };
