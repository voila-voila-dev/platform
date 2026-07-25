import {
	Container,
	type ContainerProps,
} from "#/landing/components/container.tsx";
import { Heading, type HeadingProps } from "#/landing/components/heading.tsx";
import { Section, type SectionProps } from "#/landing/components/section.tsx";
import { Text, type TextProps } from "#/landing/components/text.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * Page-opening header band (title + lead on a gradient background), as on the
 * contact/legal/blog pages of the source design. Compose: Root > Title + Lead.
 */

interface PageHeaderRootProps extends SectionProps {
	containerSize?: ContainerProps["size"];
}

function Root({
	spacing = "md",
	background = "gradient-primary",
	containerSize = "md",
	className,
	children,
	...props
}: PageHeaderRootProps) {
	return (
		<Section
			spacing={spacing}
			background={background}
			className={className}
			{...props}
		>
			<Container size={containerSize}>{children}</Container>
		</Section>
	);
}

function Title({ className, ...props }: HeadingProps) {
	return <Heading level="h1" className={cn("mb-4", className)} {...props} />;
}

function Lead({ className, ...props }: TextProps) {
	return (
		<Text
			variant="lead"
			className={cn("text-muted-foreground", className)}
			{...props}
		/>
	);
}

export const PageHeader = {
	Root,
	Title,
	Lead,
};

export type { PageHeaderRootProps };
