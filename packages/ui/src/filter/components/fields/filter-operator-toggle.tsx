import type * as React from "react";
import type { FilterLabels } from "#/filter/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"fieldset"> {
	excluded: boolean;
	onExcludedChange: (excluded: boolean) => void;
	labels: FilterLabels;
	/**
	 * An empty field has nothing to invert — "is not <nothing>" filters nothing —
	 * so the switch stays inert until the field holds a value.
	 */
	disabled?: boolean;
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
	className,
	...props
}: Props) {
	return (
		<fieldset
			data-slot="filter-operator"
			disabled={disabled}
			className={cn(
				"inline-flex items-center gap-0.5 rounded-full bg-muted p-1",
				disabled && "opacity-50",
				className,
			)}
			{...props}
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
