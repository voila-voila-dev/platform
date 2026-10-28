import type * as React from "react";
import {
	type FeatureGridCardVariants,
	featureGridCardVariants,
} from "#/landing/components/feature-grid/feature-grid-variants.ts";

import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div">, FeatureGridCardVariants {}

export function FeatureGridCard({ variant, className, ...props }: Props) {
	return (
		<div
			data-slot="feature-grid-card"
			className={cn(featureGridCardVariants({ variant }), className)}
			{...props}
		/>
	);
}
