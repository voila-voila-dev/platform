import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import type { ReactNode } from "react";
import { Button } from "#/button/components/button.tsx";
import type { FilterLabels } from "#/filter/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	label: string;
	description?: string;
	/**
	 * Ties the visible label to the control it names. Omitted by the group
	 * fields (a `<label>` would otherwise rename their first button), which name
	 * themselves through their fieldset legend.
	 */
	controlId?: string;
	/** The "is / is not" switch, when the field supports exclusion. */
	operator?: ReactNode;
	/** Omitted while the field is empty — nothing to clear. */
	onClear?: () => void;
	labels: FilterLabels;
	children: ReactNode;
}

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
	className,
	...props
}: Props) {
	return (
		<div
			data-slot="filter-field"
			className={cn("flex min-w-0 flex-col gap-2", className)}
			{...props}
		>
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
