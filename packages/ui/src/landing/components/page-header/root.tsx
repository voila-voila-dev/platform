import type * as React from "react";
import { Container } from "#/landing/components/container.tsx";
import { Section } from "#/landing/components/section.tsx";

interface Props extends React.ComponentProps<typeof Section> {
	containerSize?: React.ComponentProps<typeof Container>["size"];
}

/**
 * Page-opening header band (title + lead on a gradient background), as on the
 * contact/legal/blog pages of the source design. Compose: Root > Title + Lead.
 */
export function PageHeaderRoot({
	spacing = "md",
	background = "gradient-primary",
	containerSize = "md",
	className,
	children,
	...props
}: Props) {
	return (
		<Section
			data-slot="page-header"
			spacing={spacing}
			background={background}
			className={className}
			{...props}
		>
			<Container size={containerSize}>{children}</Container>
		</Section>
	);
}
