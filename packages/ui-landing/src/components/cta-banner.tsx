import { cn } from "@voila.dev/ui/lib/utils";

import { Container, type ContainerProps } from "#/components/container.tsx";
import { Heading, type HeadingProps } from "#/components/heading.tsx";
import { Section, type SectionProps } from "#/components/section.tsx";
import { Text, type TextProps } from "#/components/text.tsx";
import { accentHighlightBlobClass, brandGradientClass } from "#/lib/tones.ts";

/**
 * Gradient call-to-action banner with decorative blur blobs. Compose: Root > Title,
 * Description, Actions.
 */

interface CtaBannerRootProps extends SectionProps {
	containerSize?: ContainerProps["size"];
}

function Root({
	spacing = "lg",
	background,
	containerSize = "md",
	className,
	children,
	...props
}: CtaBannerRootProps) {
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

function Title({ className, ...props }: HeadingProps) {
	return (
		<Heading
			level="h2"
			align="center"
			className={cn("mb-4 text-white", className)}
			{...props}
		/>
	);
}

function Description({ className, ...props }: TextProps) {
	return (
		<Text className={cn("mb-8 text-lg text-white/90", className)} {...props} />
	);
}

function Actions({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="cta-banner-actions"
			className={cn(
				"flex flex-col justify-center gap-4 sm:flex-row",
				className,
			)}
			{...props}
		/>
	);
}

export const CtaBanner = {
	Root,
	Title,
	Description,
	Actions,
};

export type { CtaBannerRootProps };
