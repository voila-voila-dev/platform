import { accentHighlightTintClass } from "#/landing/lib/tones.ts";
import { cva, type VariantProps } from "#/lib/cva.ts";

export const testimonialAvatarVariants = cva({
	base: "flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold",
	variants: {
		accent: {
			primary: "bg-primary/10 text-primary",
			highlight: accentHighlightTintClass,
		},
	},
	defaultVariants: {
		accent: "primary",
	},
});

export type TestimonialAvatarVariants = VariantProps<
	typeof testimonialAvatarVariants
>;

export const testimonialAvatarAccentOptions = [
	"primary",
	"highlight",
] as const satisfies readonly NonNullable<
	TestimonialAvatarVariants["accent"]
>[];
