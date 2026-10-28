import { cva } from "#/lib/cva.ts";

/**
 * Single-select switcher (Day/Week/Month) with an animated selection thumb.
 * Built on radio semantics - exactly one segment is always selected - which
 * is what separates it from `ToggleGroup`'s pressable toolbar buttons.
 */
export const segmentedControlVariants = cva({
	base: "group/segmented-control relative isolate inline-flex w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
	variants: {
		/** Control height and label size. Match it to the controls beside it. */
		size: {
			default: "h-8",
			sm: "h-7 rounded-[min(var(--radius-md),12px)]",
			lg: "h-9",
		},
		/**
		 * Fill the container instead of the labels, each segment taking an equal
		 * share of it. For a control that belongs to a column — a settings rail,
		 * a form, a phone — where segments sized to their own words leave the
		 * control ragged against everything stacked with it.
		 */
		stretch: {
			true: "w-full",
			false: "",
		},
	},
	defaultVariants: {
		size: "default",
		stretch: false,
	},
});
