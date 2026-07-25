import { cva, type VariantProps } from "#/lib/cva.ts";

export const containerVariants = cva({
	base: "mx-auto w-full px-4 sm:px-6 lg:px-8",
	variants: {
		size: {
			sm: "max-w-3xl",
			md: "max-w-5xl",
			lg: "max-w-6xl",
			xl: "max-w-7xl",
			full: "max-w-full",
		},
	},
	defaultVariants: {
		size: "xl",
	},
});

export type ContainerVariants = VariantProps<typeof containerVariants>;

export const containerSizeOptions = [
	"sm",
	"md",
	"lg",
	"xl",
	"full",
] as const satisfies readonly NonNullable<ContainerVariants["size"]>[];
