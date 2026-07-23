import { cva, type VariantProps } from "@voila.dev/ui/cva";
import { cn } from "@voila.dev/ui/lib/utils";

import { Heading, type HeadingProps } from "#/components/heading.tsx";
import { Text, type TextProps } from "#/components/text.tsx";

/**
 * Centered intro block opening a section: Eyebrow + title + lead. Factors out
 * the header markup most sections repeat.
 */

const sectionIntroVariants = cva({
	base: "mx-auto text-center",
	variants: {
		width: {
			md: "max-w-2xl",
			lg: "max-w-3xl",
		},
		spacing: {
			md: "mb-12",
			lg: "mb-16",
		},
	},
	defaultVariants: {
		width: "md",
		spacing: "lg",
	},
});

type SectionIntroVariants = VariantProps<typeof sectionIntroVariants>;

const sectionIntroWidthOptions = [
	"md",
	"lg",
] as const satisfies readonly NonNullable<SectionIntroVariants["width"]>[];

const sectionIntroSpacingOptions = [
	"md",
	"lg",
] as const satisfies readonly NonNullable<SectionIntroVariants["spacing"]>[];

interface SectionIntroRootProps
	extends React.ComponentProps<"div">,
		SectionIntroVariants {}

function Root({ width, spacing, className, ...props }: SectionIntroRootProps) {
	return (
		<div
			data-slot="section-intro"
			className={cn(sectionIntroVariants({ width, spacing }), className)}
			{...props}
		/>
	);
}

function Title({ className, ...props }: HeadingProps) {
	return (
		<Heading
			level="h2"
			align="center"
			className={cn("mb-4", className)}
			{...props}
		/>
	);
}

function Description(props: TextProps) {
	return <Text variant="lead" align="center" {...props} />;
}

export const SectionIntro = {
	Root,
	Title,
	Description,
};

export type { SectionIntroRootProps, SectionIntroVariants };
export {
	sectionIntroSpacingOptions,
	sectionIntroVariants,
	sectionIntroWidthOptions,
};
