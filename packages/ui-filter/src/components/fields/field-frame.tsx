import { XIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/components/button";
import { cn } from "@voila.dev/ui/lib/utils";
import type { ReactNode } from "react";
import type { FilterLabels } from "#/types.ts";

/**
 * The chrome every filter field shares: a label row that also hosts the
 * "is / is not" switch and the clear action, then the control itself. One frame
 * for all kinds is what makes a screenful of mixed filters read as one thing.
 */
export function FilterFieldFrame({
	label,
	description,
	controlId,
	operator,
	onClear,
	labels,
	children,
}: {
	readonly label: string;
	readonly description?: string;
	/**
	 * Ties the visible label to the control it names. Omitted by the group
	 * fields (a `<label>` would otherwise rename their first button), which name
	 * themselves through their fieldset legend.
	 */
	readonly controlId?: string;
	/** The "is / is not" switch, when the field supports exclusion. */
	readonly operator?: ReactNode;
	/** Omitted while the field is empty — nothing to clear. */
	readonly onClear?: () => void;
	readonly labels: FilterLabels;
	readonly children: ReactNode;
}) {
	return (
		<div className="flex min-w-0 flex-col gap-2" data-slot="filter-field">
			{/* `min-h-9` is the clear button's height: the row reserves it whether or
			    not the button is there, so filling a field doesn't shove the one
			    below it down. */}
			<div className="flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1">
				<label
					htmlFor={controlId}
					className="font-medium text-foreground text-sm"
				>
					{label}
				</label>
				{operator}
				{onClear !== undefined && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="ml-auto text-muted-foreground"
						onClick={onClear}
					>
						<XIcon />
						{labels.clear}
					</Button>
				)}
			</div>
			{description !== undefined && (
				<p className="text-muted-foreground text-xs">{description}</p>
			)}
			{children}
		</div>
	);
}

/**
 * The inversion switch: two segments, "is" and "is not". A checkbox reads as
 * an option you might miss; two segments state the operator outright, which is
 * what an exclusion filter has to do to be trusted.
 */
export function FilterOperatorToggle({
	excluded,
	onExcludedChange,
	labels,
	disabled = false,
}: {
	readonly excluded: boolean;
	readonly onExcludedChange: (excluded: boolean) => void;
	readonly labels: FilterLabels;
	/**
	 * An empty field has nothing to invert — "is not <nothing>" filters nothing —
	 * so the switch stays inert until the field holds a value.
	 */
	readonly disabled?: boolean;
}) {
	return (
		<fieldset
			data-slot="filter-operator"
			disabled={disabled}
			className={cn(
				"inline-flex items-center gap-0.5 rounded-full bg-muted p-1",
				disabled && "opacity-50",
			)}
		>
			<legend className="sr-only">{`${labels.is} / ${labels.isNot}`}</legend>
			{[false, true].map((isExcluded) => (
				<button
					key={String(isExcluded)}
					type="button"
					// Also on the button, not only the fieldset: assistive tech and
					// tests read the property, which a fieldset does not propagate.
					disabled={disabled}
					aria-pressed={excluded === isExcluded}
					onClick={() => onExcludedChange(isExcluded)}
					// Segments are thumb-sized (min 44px wide, 28px tall inside a 36px
					// row): the earlier text-xs pills were a mouse-only target.
					className={cn(
						"min-h-7 min-w-11 cursor-pointer rounded-full px-3 text-sm transition-colors disabled:cursor-not-allowed",
						excluded === isExcluded
							? "bg-background font-medium text-foreground shadow-xs"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{isExcluded ? labels.isNot : labels.is}
				</button>
			))}
		</fieldset>
	);
}

/** Two bounds side by side — the layout shared by every range field. */
export function FilterRangeRow({ children }: { readonly children: ReactNode }) {
	return (
		<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{children}</div>
	);
}
