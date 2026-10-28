import { cva, type VariantProps } from "#/lib/cva.ts";

export const headingVariants = cva({
	base: "font-heading font-bold tracking-tight text-foreground",
	variants: {
		/**
		 * The heading element that renders, and its type scale. Pick by document
		 * outline, not by how large you want the text — reach for `Text` and its
		 * `size` when you only want bigger copy.
		 */
		level: {
			h1: "text-4xl md:text-5xl lg:text-6xl",
			h2: "text-3xl md:text-4xl lg:text-5xl",
			h3: "text-2xl md:text-3xl",
			h4: "text-xl md:text-2xl",
			h5: "text-lg md:text-xl",
			h6: "text-base md:text-lg",
		},
		/**
		 * Text alignment. `center` suits a section intro; anything longer than a
		 * line or two reads better left-aligned.
		 */
		align: {
			left: "text-left",
			center: "text-center",
			right: "text-right",
		},
	},
	defaultVariants: {
		level: "h2",
		align: "left",
	},
});

export type HeadingVariants = VariantProps<typeof headingVariants>;

export const headingLevelOptions = [
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
] as const satisfies readonly NonNullable<HeadingVariants["level"]>[];

export const headingAlignOptions = [
	"left",
	"center",
	"right",
] as const satisfies readonly NonNullable<HeadingVariants["align"]>[];
