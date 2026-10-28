import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Bento grid with a featured gradient tile. Compose: Root > FeaturedItem
 * (FeaturedContent > FeaturedIcon/FeaturedLabel/FeaturedTitle +
 * FeaturedDescription) + Item (ItemIcon + ItemBody > ItemTitle/ItemDescription).
 */
export function BentoGridRoot({ className, ...props }: Props) {
	return (
		<div
			data-slot="bento-grid"
			className={cn("grid gap-6 lg:grid-cols-3", className)}
			{...props}
		/>
	);
}
