import type * as React from "react";
import { Container } from "#/landing/components/container.tsx";
import { Section } from "#/landing/components/section.tsx";
import {
	accentHighlightBlobClass,
	brandGradientClass,
} from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Section> {
	containerSize?: React.ComponentProps<typeof Container>["size"];
}

/**
 * Gradient call-to-action banner with decorative blur blobs. Compose: Root >
 * Title, Description, Actions.
 */
export function CtaBannerRoot({
	spacing = "lg",
	background,
	containerSize = "md",
	className,
	children,
	...props
}: Props) {
	return (
		<Section
			spacing={spacing}
			background={background}
			className={className}
			{...props}
		>
			<Container size={containerSize}>
				<div
					data-slot="cta-banner"
					className={cn(
						"relative overflow-hidden rounded-3xl px-6 py-12 text-center text-primary-foreground shadow-xl sm:px-12 sm:py-16",
						brandGradientClass,
					)}
				>
					<div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
					<div
						className={cn(
							"pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full blur-3xl",
							accentHighlightBlobClass,
						)}
					/>

					<div className="relative mx-auto max-w-2xl">{children}</div>
				</div>
			</Container>
		</Section>
	);
}
