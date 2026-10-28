import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { FeatureGridToneContext } from "#/components/feature-grid/context/feature-grid-context.ts";
import {
	type FeatureGridVariants,
	featureGridVariants,
} from "#/components/feature-grid/feature-grid-variants.ts";
import type { Tone } from "#/lib/tones.ts";

interface Props extends React.ComponentProps<"div">, FeatureGridVariants {
	/**
	 * Which brand role colours this section: the tint, the solid fill and any
	 * connector line move together. Tokens, so a rebrand reaches them.
	 */
	tone?: Tone;
}

/**
 * Grid of icon cards (pain points, benefits, product highlights). Compose: Root
 * (tone, columns) > Card > CardIcon + CardTitle + CardDescription.
 */
export function FeatureGridRoot({
	tone = "primary",
	columns,
	className,
	...props
}: Props) {
	return (
		<FeatureGridToneContext.Provider value={tone}>
			<div
				data-slot="feature-grid"
				className={cn(featureGridVariants({ columns }), className)}
				{...props}
			/>
		</FeatureGridToneContext.Provider>
	);
}
