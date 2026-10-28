import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** Adds the top hairline + spacing used when the row closes a hero. */
	bordered?: boolean;
}

/**
 * Horizontal row of value/label stats separated by hairline dividers, the kind
 * that usually closes a hero.
 */
export function StatsRowRoot({ bordered = true, className, ...props }: Props) {
	return (
		<div
			data-slot="stats-row"
			className={cn(
				"flex items-center gap-6 sm:gap-8",
				bordered && "mt-10 border-t border-border/50 pt-8",
				className,
			)}
			{...props}
		/>
	);
}
