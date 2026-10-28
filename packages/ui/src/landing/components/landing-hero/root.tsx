import type * as React from "react";
import { Container } from "#/landing/components/container.tsx";
import {
	type LandingHeroLayoutVariants,
	landingHeroLayoutVariants,
} from "#/landing/components/landing-hero/landing-hero-variants.ts";
import { Section } from "#/landing/components/section.tsx";
import { cn } from "#/lib/utils.ts";

interface Props
	extends React.ComponentProps<typeof Section>,
		LandingHeroLayoutVariants {}

/**
 * Landing page hero. Split layout = content column + illustration/media column;
 * centered layout for media-less heroes. Compose: Root > Content (Eyebrow,
 * Title + Highlight, Lead, Actions, StatsRow) + Media.
 */
export function LandingHeroRoot({
	layout,
	spacing = "lg",
	background,
	className,
	children,
	...props
}: Props) {
	return (
		<Section
			data-slot="landing-hero"
			spacing={spacing}
			background={background}
			className={cn("overflow-hidden", className)}
			{...props}
		>
			<Container>
				<div className={landingHeroLayoutVariants({ layout })}>{children}</div>
			</Container>
		</Section>
	);
}
