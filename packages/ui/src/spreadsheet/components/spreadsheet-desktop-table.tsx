import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { SpreadsheetDropLineIndicator } from "#/spreadsheet/components/spreadsheet-drop-line-indicator.tsx";
import {
	SpreadsheetContext,
	type SpreadsheetContextValue,
} from "#/spreadsheet/context/spreadsheet-context.ts";
import type { SpreadsheetDropLine } from "#/spreadsheet/hooks/use-spreadsheet-drag.ts";
import type { useSpreadsheetGrid } from "#/spreadsheet/hooks/use-spreadsheet-grid.ts";

interface Props {
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
}

/** The scroll container + table + drag overlays of the desktop rendering. */
export function SpreadsheetDesktopTable({
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
}: Props) {
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
