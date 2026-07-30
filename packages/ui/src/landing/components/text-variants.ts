import { cva, type VariantProps } from "#/lib/cva.ts";

export const textVariants = cva({
	base: "leading-relaxed",
	variants: {
		/**
		 * Role of the copy. `lead` is a standfirst under a heading, `muted` is
		 * secondary detail, `body` is everything else.
		 */
		variant: {
			body: "text-foreground",
			muted: "text-muted-foreground",
			lead: "text-xl text-muted-foreground",
		},
		/**
		 * Type scale, independent of `variant` so a `muted` note can still be
		 * large.
		 */
		size: {
			xs: "text-xs",
			sm: "text-sm",
			base: "text-base",
			lg: "text-lg",
			xl: "text-xl",
		},
		/** Text alignment. */
		align: {
			left: "text-left",
			center: "text-center",
			right: "text-right",
		},
		/**
		 * Font weight. Prefer a heading over bold body copy when the text is
		 * actually a heading.
		 */
		weight: {
			normal: "font-normal",
			medium: "font-medium",
			semibold: "font-semibold",
			bold: "font-bold",
		},
	},
	defaultVariants: {
		variant: "body",
		size: "base",
		align: "left",
		weight: "normal",
	},
});

export type TextVariants = VariantProps<typeof textVariants>;

export const textVariantOptions = [
	"body",
	"muted",
	"lead",
] as const satisfies readonly NonNullable<TextVariants["variant"]>[];

export const textSizeOptions = [
	"xs",
	"sm",
	"base",
	"lg",
	"xl",
] as const satisfies readonly NonNullable<TextVariants["size"]>[];

export const textAlignOptions = [
	"left",
	"center",
	"right",
] as const satisfies readonly NonNullable<TextVariants["align"]>[];

export const textWeightOptions = [
	"normal",
	"medium",
	"semibold",
	"bold",
] as const satisfies readonly NonNullable<TextVariants["weight"]>[];
