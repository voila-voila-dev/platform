import { cva } from "#/lib/cva.ts";

export const statCardDeltaVariants = cva({
	base: "inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums [&_svg]:size-3.5 [&_svg]:shrink-0",
	variants: {
		trend: {
			up: "text-success",
			down: "text-destructive",
			neutral: "text-muted-foreground",
		},
	},
	defaultVariants: {
		trend: "neutral",
	},
});
