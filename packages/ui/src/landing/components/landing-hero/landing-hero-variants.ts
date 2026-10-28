import { cva, type VariantProps } from "#/lib/cva.ts";

export const landingHeroLayoutVariants = cva({
	base: "grid items-center gap-12",
	variants: {
		/**
		 * `split` sets the copy beside the media; `centered` stacks and centres
		 * the copy with no media column.
		 */
		layout: {
			split: "lg:grid-cols-2",
			centered: "justify-items-center text-center",
		},
	},
	defaultVariants: {
		layout: "split",
	},
});

export type LandingHeroLayoutVariants = VariantProps<
	typeof landingHeroLayoutVariants
>;

export const landingHeroLayoutOptions = [
	"split",
	"centered",
] as const satisfies readonly NonNullable<
	LandingHeroLayoutVariants["layout"]
>[];
