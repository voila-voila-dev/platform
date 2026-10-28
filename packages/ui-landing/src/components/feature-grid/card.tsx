import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import {
	type FeatureGridCardVariants,
	featureGridCardVariants,
} from "#/components/feature-grid/feature-grid-variants.ts";

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
