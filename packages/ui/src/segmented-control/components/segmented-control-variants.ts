import { cva } from "#/lib/cva.ts";

/**
 * Single-select switcher (Day/Week/Month) with an animated selection thumb.
 * Built on radio semantics - exactly one segment is always selected - which
 * is what separates it from `ToggleGroup`'s pressable toolbar buttons.
 */
export const segmentedControlVariants = cva({
	base: "group/segmented-control relative isolate inline-flex w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
	variants: {
		size: {
			default: "h-8",
			sm: "h-7 rounded-[min(var(--radius-md),12px)]",
			lg: "h-9",
		},
	},
	defaultVariants: {
		size: "default",
	},
});
