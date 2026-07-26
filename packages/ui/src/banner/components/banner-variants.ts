import { cva } from "#/lib/cva.ts";

export const bannerVariants = cva({
	base: "group/banner relative flex w-full items-center gap-3 px-4 py-2.5 text-sm has-data-[slot=banner-close]:pr-12 md:px-6 [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground",
			muted: "bg-muted text-foreground",
			success: "bg-success text-success-foreground",
			warning: "bg-warning text-warning-foreground",
			destructive: "bg-destructive text-destructive-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});
