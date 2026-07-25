import { cva, type VariantProps } from "#/lib/cva.ts";

export const textVariants = cva({
	base: "leading-relaxed",
	variants: {
		variant: {
			body: "text-foreground",
			muted: "text-muted-foreground",
			lead: "text-xl text-muted-foreground",
		},
		size: {
			xs: "text-xs",
			sm: "text-sm",
			base: "text-base",
			lg: "text-lg",
			xl: "text-xl",
		},
		align: {
			left: "text-left",
			center: "text-center",
			right: "text-right",
		},
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
