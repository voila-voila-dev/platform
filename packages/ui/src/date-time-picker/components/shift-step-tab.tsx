import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"button"> {
	active: boolean;
	heading: string;
	value: string;
}

/** One of the two step tabs: a heading over the side's current datetime summary. */
export function ShiftStepTab({
	active,
	heading,
	value,
	className,
	...props
}: Props) {
	return (
		<button
			type="button"
			data-slot="shift-step-tab"
			data-active={active || undefined}
			className={cn(
				"flex flex-col items-start gap-0.5 rounded-md border border-transparent px-2.5 py-1.5 text-left transition-colors hover:bg-accent data-active:border-input data-active:bg-accent",
				className,
			)}
			{...props}
		>
			<span className="font-medium text-muted-foreground text-xs">
				{heading}
			</span>
			<span className="line-clamp-1 text-sm">{value}</span>
		</button>
	);
}
