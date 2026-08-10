import type * as React from "react";
import { Card } from "#/card/components/card.tsx";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";
import { statCardRootVariants } from "#/stat-card/components/stat-card-root-variants.ts";

export type StatCardStatus = "on-track" | "below-objective" | "alerting";

interface Props
	extends React.ComponentProps<typeof Card.Root>,
		VariantProps<typeof statCardRootVariants> {}

/**
 * KPI tile for dashboards: a Card composition pairing a muted label, a large
 * value, an optional trend delta and an optional full-bleed sparkline. Put a
 * `Chart.Root` inside `StatCard.Chart` — or `Chart.Skeleton` / `Chart.Empty`
 * (from `@voila.dev/ui/chart`) while the metric is loading or has no data.
 * `status` tints the frame by how the metric stands against its objective.
 */
export function StatCardRoot({ className, status, ...props }: Props) {
	return (
		<Card.Root
			data-slot="stat-card"
			data-status={status}
			className={cn(statCardRootVariants({ status }), className)}
			{...props}
		/>
	);
}
