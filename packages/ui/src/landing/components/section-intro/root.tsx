import type * as React from "react";
import {
	type SectionIntroVariants,
	sectionIntroVariants,
} from "#/landing/components/section-intro/section-intro-variants.ts";

import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div">, SectionIntroVariants {}

/**
 * Centered intro block opening a section: Eyebrow + title + lead. Factors out
 * the header markup most sections repeat.
 */
export function SectionIntroRoot({
	width,
	spacing,
	className,
	...props
}: Props) {
	return (
		<div
			data-slot="section-intro"
			className={cn(sectionIntroVariants({ width, spacing }), className)}
			{...props}
		/>
	);
}
