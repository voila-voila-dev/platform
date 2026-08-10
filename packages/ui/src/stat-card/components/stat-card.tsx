import { StatCardChart } from "#/stat-card/components/stat-card-chart.tsx";
import { StatCardDelta } from "#/stat-card/components/stat-card-delta.tsx";
import { StatCardHeader } from "#/stat-card/components/stat-card-header.tsx";
import { StatCardLabel } from "#/stat-card/components/stat-card-label.tsx";
import { StatCardRoot } from "#/stat-card/components/stat-card-root.tsx";
import { StatCardTarget } from "#/stat-card/components/stat-card-target.tsx";
import { StatCardValue } from "#/stat-card/components/stat-card-value.tsx";

export type { StatCardTrend } from "#/stat-card/components/stat-card-delta.tsx";
export { statCardDeltaVariants } from "#/stat-card/components/stat-card-delta-variants.ts";
export type { StatCardStatus } from "#/stat-card/components/stat-card-root.tsx";
export { statCardRootVariants } from "#/stat-card/components/stat-card-root-variants.ts";

/**
 * The StatCard parts as one namespace.
 */
export const StatCard = {
	Root: StatCardRoot,
	Chart: StatCardChart,
	Delta: StatCardDelta,
	Header: StatCardHeader,
	Label: StatCardLabel,
	Target: StatCardTarget,
	Value: StatCardValue,
};
