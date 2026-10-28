import { FeatureGridCard } from "#/components/feature-grid/card.tsx";
import { FeatureGridCardDescription } from "#/components/feature-grid/card-description.tsx";
import { FeatureGridCardIcon } from "#/components/feature-grid/card-icon.tsx";
import { FeatureGridCardTitle } from "#/components/feature-grid/card-title.tsx";
import { FeatureGridRoot } from "#/components/feature-grid/root.tsx";

/** Compose: `Root > Card > CardIcon + CardTitle + CardDescription`. */
export const FeatureGrid = {
	Root: FeatureGridRoot,
	Card: FeatureGridCard,
	CardIcon: FeatureGridCardIcon,
	CardTitle: FeatureGridCardTitle,
	CardDescription: FeatureGridCardDescription,
};
