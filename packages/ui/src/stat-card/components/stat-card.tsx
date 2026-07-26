import { StatCardChart } from "#/stat-card/components/stat-card-chart.tsx";
import { StatCardDelta } from "#/stat-card/components/stat-card-delta.tsx";
import { StatCardHeader } from "#/stat-card/components/stat-card-header.tsx";
import { StatCardLabel } from "#/stat-card/components/stat-card-label.tsx";
import { StatCardRoot } from "#/stat-card/components/stat-card-root.tsx";
import { StatCardValue } from "#/stat-card/components/stat-card-value.tsx";

export type { StatCardTrend } from "#/stat-card/components/stat-card-delta.tsx";
export { statCardDeltaVariants } from "#/stat-card/components/stat-card-delta-variants.ts";

/**
 * The StatCard parts as one namespace.
 */
export const StatCard = {
	Root: StatCardRoot,
	Chart: StatCardChart,
	Delta: StatCardDelta,
	Header: StatCardHeader,
	Label: StatCardLabel,
	Value: StatCardValue,
};
