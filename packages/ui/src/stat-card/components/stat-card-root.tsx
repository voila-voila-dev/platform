import type * as React from "react";
import { Card } from "#/card/components/card.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Card.Root> {}

/**
 * KPI tile for dashboards: a Card composition pairing a muted label, a large
 * value, an optional trend delta and an optional full-bleed sparkline. Put a
 * `Chart.Root` inside `StatCard.Chart` — or `Chart.Skeleton` / `Chart.Empty`
 * (from `@voila.dev/ui/chart`) while the metric is loading or has no data.
 */
export function StatCardRoot({ className, ...props }: Props) {
	return (
		<Card.Root
			data-slot="stat-card"
			className={cn("gap-1.5", className)}
			{...props}
		/>
	);
}
