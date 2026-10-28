import type * as React from "react";
import { ComparisonToneContext } from "#/landing/components/comparison-section/context/comparison-section-context.ts";
import { Container } from "#/landing/components/container.tsx";
import { Section } from "#/landing/components/section.tsx";
import type { Tone } from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Section> {
	/**
	 * Which brand role colours this section: the tint, the solid fill and any
	 * connector line move together. Tokens, so a rebrand reaches them.
	 */
	tone?: Tone;
}

/**
 * Before/after benefits split (crossed-out list vs checked list + tag chips +
 * illustration). Compose: Root (tone) > Content (Eyebrow, Heading, Panels >
 * Panel > PanelTitle + PanelList > PanelItem, TagList > Tag, actions) + Media.
 */
export function ComparisonSectionRoot({
	tone = "primary",
	spacing = "lg",
	background,
	className,
	children,
	...props
}: Props) {
	return (
		<ComparisonToneContext.Provider value={tone}>
			{/* overflow-hidden: the Media illustrations carry decorative blur blobs
			    that would otherwise create a few pixels of horizontal scroll. */}
			<Section
				data-slot="comparison-section"
				spacing={spacing}
				background={background}
				className={cn("overflow-hidden", className)}
				{...props}
			>
				<Container>
					<div className="grid items-center gap-12 lg:grid-cols-2">
						{children}
					</div>
				</Container>
			</Section>
		</ComparisonToneContext.Provider>
	);
}
