import type * as React from "react";
import { FeatureGridToneContext } from "#/landing/components/feature-grid/context/feature-grid-context.ts";
import {
	type FeatureGridVariants,
	featureGridVariants,
} from "#/landing/components/feature-grid/feature-grid-variants.ts";
import type { Tone } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div">, FeatureGridVariants {
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
