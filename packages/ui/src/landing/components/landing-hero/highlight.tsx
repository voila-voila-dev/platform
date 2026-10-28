import type * as React from "react";
import { type Tone, toneTextClass } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {
	/**
	 * Which brand role colours this section: the tint, the solid fill and any
	 * connector line move together. Tokens, so a rebrand reaches them.
	 */
	tone?: Tone;
}

/** Colored span inside the title — the multi-tone headline of the home hero. */
export function LandingHeroHighlight({
	tone = "primary",
	className,
	...props
}: Props) {
	return (
		<span
			data-slot="landing-hero-highlight"
			className={cn(toneTextClass[tone], className)}
			{...props}
		/>
	);
}
