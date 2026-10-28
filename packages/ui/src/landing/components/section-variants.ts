import { cva, type VariantProps } from "#/lib/cva.ts";

export const sectionVariants = cva({
	base: "relative",
	variants: {
		/**
		 * Vertical padding, which grows at `md` and up. `none` when the section
		 * supplies its own rhythm.
		 */
		spacing: {
			none: "",
			sm: "py-12 md:py-16",
			md: "py-16 md:py-24",
			lg: "py-24 md:py-32",
			xl: "py-32 md:py-40",
		},
		/**
		 * Surface behind the section. The three gradients read as brand moments —
		 * one per page is usually one enough. `brand` also flips the foreground to
		 * `primary-foreground`.
		 */
		background: {
			default: "bg-background",
			muted: "bg-muted",
			brand: "bg-brand text-primary-foreground",
			gradient: "bg-gradient-to-br from-background via-background to-muted",
			"gradient-primary":
				"bg-gradient-to-br from-primary/5 via-background to-primary/10",
			"gradient-brand":
				"bg-gradient-to-br from-brand/5 via-background to-brand/10",
		},
	},
	defaultVariants: {
		spacing: "md",
		background: "default",
	},
});

export type SectionVariants = VariantProps<typeof sectionVariants>;

export const sectionSpacingOptions = [
	"none",
	"sm",
	"md",
	"lg",
	"xl",
] as const satisfies readonly NonNullable<SectionVariants["spacing"]>[];

export const sectionBackgroundOptions = [
	"default",
	"muted",
	"brand",
	"gradient",
	"gradient-primary",
	"gradient-brand",
] as const satisfies readonly NonNullable<SectionVariants["background"]>[];
