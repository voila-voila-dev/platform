import { cva, type VariantProps } from "#/lib/cva.ts";

export const sectionIntroVariants = cva({
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

export type SectionIntroVariants = VariantProps<typeof sectionIntroVariants>;

export const sectionIntroWidthOptions = [
	"md",
	"lg",
] as const satisfies readonly NonNullable<SectionIntroVariants["width"]>[];

export const sectionIntroSpacingOptions = [
	"md",
	"lg",
] as const satisfies readonly NonNullable<SectionIntroVariants["spacing"]>[];
