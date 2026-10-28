import { StatsRowDivider } from "#/landing/components/stats-row/divider.tsx";
import { StatsRowItem } from "#/landing/components/stats-row/item.tsx";
import { StatsRowLabel } from "#/landing/components/stats-row/label.tsx";
import { StatsRowRoot } from "#/landing/components/stats-row/root.tsx";
import { StatsRowValue } from "#/landing/components/stats-row/value.tsx";

/** Compose: `Root > (Item > Value + Label) + Divider…`. */
export const StatsRow = {
	Root: StatsRowRoot,
	Item: StatsRowItem,
	Value: StatsRowValue,
	Label: StatsRowLabel,
	Divider: StatsRowDivider,
};
