import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "#/button/components/button.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** Selected-row count. The bar only renders while it is above zero. */
	count: number;
	/** The count, spelled out ("3 selected"). This package ships no translations. */
	label: string;
	/** Clears the selection. Drawn as the closing X at the end of the bar. */
	onClear: () => void;
	/** Accessible name for that X. */
	clearLabel: string;
	/**
	 * Cross-page "select all" affordance, shown while the selection is partial.
	 * Omit it once everything is selected, or when "all" has no meaning.
	 */
	selectAll?: {
		readonly label: string;
		readonly onSelect: () => void;
	};
}

/**
 * Floating bulk-action bar for a table selection: a pill fixed above the
 * bottom edge, portalled to `document.body` so it never displaces the layout
 * behind it — revealing or clearing a selection must not shift the table.
 *
 * Compose the actions as children (buttons, confirm dialogs). Pair with
 * `dataTableSelectionColumn` and the `DataTable` selection props.
 */
export function DataTableSelectionBar({
	count,
	label,
	onClear,
	clearLabel,
	selectAll,
	className,
	children,
	...props
}: Props) {
	if (count <= 0) {
		return null;
	}

	return createPortal(
		<div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
			<div
				role="toolbar"
				aria-label={label}
				data-slot="data-table-selection-bar"
				className={cn(
					"pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl bg-popover px-4 py-2 text-popover-foreground text-sm shadow-lg ring-1 ring-foreground/10 sm:rounded-full",
					"animate-in fade-in-0 slide-in-from-bottom-2 duration-150 motion-reduce:animate-none",
					className,
				)}
				{...props}
			>
				<span className="whitespace-nowrap font-medium">{label}</span>
				{selectAll !== undefined && (
					<button
						type="button"
						onClick={selectAll.onSelect}
						className="whitespace-nowrap text-primary underline underline-offset-4"
					>
						{selectAll.label}
					</button>
				)}
				{children}
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					onClick={onClear}
					aria-label={clearLabel}
				>
					<XIcon />
				</Button>
			</div>
		</div>,
		document.body,
	);
}
