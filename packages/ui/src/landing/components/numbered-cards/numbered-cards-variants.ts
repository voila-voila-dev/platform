import { cva, type VariantProps } from "#/lib/cva.ts";

export const numberedCardsVariants = cva({
	base: "grid gap-6",
	variants: {
		/**
		 * Columns at the widest breakpoint. Narrower viewports collapse toward a
		 * single column regardless.
		 */
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

export type NumberedCardsVariants = VariantProps<typeof numberedCardsVariants>;

export const numberedCardsColumnsOptions = [
	"2",
	"3",
	"4",
] as const satisfies readonly NonNullable<NumberedCardsVariants["columns"]>[];
