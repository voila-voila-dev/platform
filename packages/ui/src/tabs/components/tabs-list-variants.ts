import { cva } from "#/lib/cva.ts";

export const tabsListVariants = cva({
	base: "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-8 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
	variants: {
		/**
		 * `default` sits the tabs in a filled track; `line` drops the track and
		 * marks the active tab with an underline.
		 */
		variant: {
			default: "bg-muted",
			line: "gap-1 bg-transparent",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});
