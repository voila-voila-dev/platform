import { useVirtualizer } from "@tanstack/react-virtual";
import * as React from "react";
import { SpreadsheetVirtualSpacer } from "#/spreadsheet/components/spreadsheet-virtual-spacer.tsx";
import {
	SpreadsheetContext,
	SpreadsheetRowIndexContext,
} from "#/spreadsheet/context/spreadsheet-context.ts";

interface Props {
	/** Total number of rows, mounted or not. */
	count: number;
	/** Pixel height of one row, borders included. */
	estimatedRowHeight?: number;
	/** Extra rows rendered on both sides of the visible window. */
	overscan?: number;
	children: (index: number) => React.ReactNode;
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
export function SpreadsheetVirtualRows({
	count,
	estimatedRowHeight = 33,
	overscan = 8,
	children,
}: Props) {
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
