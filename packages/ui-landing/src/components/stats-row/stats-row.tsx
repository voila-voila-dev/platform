import { StatsRowDivider } from "#/components/stats-row/divider.tsx";
import { StatsRowItem } from "#/components/stats-row/item.tsx";
import { StatsRowLabel } from "#/components/stats-row/label.tsx";
import { StatsRowRoot } from "#/components/stats-row/root.tsx";
import { StatsRowValue } from "#/components/stats-row/value.tsx";

/** Compose: `Root > (Item > Value + Label) + Divider…`. */
export const StatsRow = {
	Root: StatsRowRoot,
	Item: StatsRowItem,
	Value: StatsRowValue,
	Label: StatsRowLabel,
	Divider: StatsRowDivider,
};
