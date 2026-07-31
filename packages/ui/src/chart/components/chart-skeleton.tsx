import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { Skeleton } from "#/skeleton/components/skeleton.tsx";

/**
 * Loading placeholder shaped like a bar chart. Defaults to the root's
 * aspect-video box — size it like the chart it stands in for (the same
 * `h-* w-full`), or the page will jump when the data lands.
 *
 * The English default label matches the kit's other built-in labels; pass a
 * localized `label` from the app.
 */

/** Fixed, not random, so the server and the client render the same bars. */
const BAR_HEIGHTS = [40, 70, 55, 90, 65, 80, 50] as const;

interface Props extends React.ComponentProps<"div"> {
	/** Accessible name announced while the chart loads. */
	readonly label?: string;
}

export function ChartSkeleton({
	className,
	label = "Loading",
	...props
}: Props) {
	return (
		<div
			data-slot="chart-skeleton"
			role="status"
			aria-label={label}
			className={cn("flex aspect-video w-full items-end gap-2", className)}
			{...props}
		>
			{BAR_HEIGHTS.map((barHeight) => (
				<Skeleton
					key={barHeight}
					className="w-full"
					style={{ height: `${barHeight}%` }}
				/>
			))}
		</div>
	);
}
