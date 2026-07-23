import { cva, type VariantProps } from "@voila.dev/ui/cva";

export const sectionVariants = cva({
	base: "relative",
	variants: {
		spacing: {
			none: "",
			sm: "py-12 md:py-16",
			md: "py-16 md:py-24",
			lg: "py-24 md:py-32",
			xl: "py-32 md:py-40",
		},
		background: {
			default: "bg-background",
			muted: "bg-muted",
			provider: "bg-provider text-primary-foreground",
			gradient: "bg-gradient-to-br from-background via-background to-muted",
			"gradient-primary":
				"bg-gradient-to-br from-primary/5 via-background to-primary/10",
			"gradient-provider":
				"bg-gradient-to-br from-provider/5 via-background to-provider/10",
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
	"provider",
	"gradient",
	"gradient-primary",
	"gradient-provider",
] as const satisfies readonly NonNullable<SectionVariants["background"]>[];
