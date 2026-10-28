import { BentoGridFeaturedContent } from "#/components/bento-grid/featured-content.tsx";
import { BentoGridFeaturedDescription } from "#/components/bento-grid/featured-description.tsx";
import { BentoGridFeaturedIcon } from "#/components/bento-grid/featured-icon.tsx";
import { BentoGridFeaturedItem } from "#/components/bento-grid/featured-item.tsx";
import { BentoGridFeaturedLabel } from "#/components/bento-grid/featured-label.tsx";
import { BentoGridFeaturedTitle } from "#/components/bento-grid/featured-title.tsx";
import { BentoGridItem } from "#/components/bento-grid/item.tsx";
import { BentoGridItemBody } from "#/components/bento-grid/item-body.tsx";
import { BentoGridItemDescription } from "#/components/bento-grid/item-description.tsx";
import { BentoGridItemIcon } from "#/components/bento-grid/item-icon.tsx";
import { BentoGridItemLayout } from "#/components/bento-grid/item-layout.tsx";
import { BentoGridItemTitle } from "#/components/bento-grid/item-title.tsx";
import { BentoGridRoot } from "#/components/bento-grid/root.tsx";

/**
 * Compose: `Root > FeaturedItem (FeaturedContent > FeaturedIcon/FeaturedLabel/
 * FeaturedTitle + FeaturedDescription) + Item (ItemIcon + ItemBody >
 * ItemTitle/ItemDescription)`.
 */
export const BentoGrid = {
	Root: BentoGridRoot,
	FeaturedItem: BentoGridFeaturedItem,
	FeaturedContent: BentoGridFeaturedContent,
	FeaturedIcon: BentoGridFeaturedIcon,
	FeaturedLabel: BentoGridFeaturedLabel,
	FeaturedTitle: BentoGridFeaturedTitle,
	FeaturedDescription: BentoGridFeaturedDescription,
	Item: BentoGridItem,
	ItemLayout: BentoGridItemLayout,
	ItemIcon: BentoGridItemIcon,
	ItemBody: BentoGridItemBody,
	ItemTitle: BentoGridItemTitle,
	ItemDescription: BentoGridItemDescription,
};
