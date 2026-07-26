import { cva, type VariantProps } from "#/lib/cva.ts";

export const featureGridVariants = cva({
	base: "grid gap-6",
	variants: {
		columns: {
			"2": "md:grid-cols-2",
			"3": "md:grid-cols-3",
			"4": "md:grid-cols-2 lg:grid-cols-4",
		},
	},
	defaultVariants: {
		columns: "3",
	},
});

export const featureGridCardVariants = cva({
	base: "h-full rounded-2xl bg-card text-card-foreground transition-all duration-200",
	variants: {
		variant: {
			elevated: "border border-transparent p-8 shadow-lg",
			outline: "border border-border p-8",
		},
	},
	defaultVariants: {
		variant: "elevated",
	},
});

export type FeatureGridVariants = VariantProps<typeof featureGridVariants>;

export const featureGridColumnsOptions = [
	"2",
	"3",
	"4",
] as const satisfies readonly NonNullable<FeatureGridVariants["columns"]>[];

export type FeatureGridCardVariants = VariantProps<
	typeof featureGridCardVariants
>;

export const featureGridCardVariantOptions = [
	"elevated",
	"outline",
] as const satisfies readonly NonNullable<FeatureGridCardVariants["variant"]>[];
