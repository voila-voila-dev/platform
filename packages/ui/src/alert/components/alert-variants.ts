import { cva } from "#/lib/cva.ts";

export const alertVariants = cva({
	base: "group/alert relative grid w-full grid-cols-1 gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-data-[slot=alert-action]:gap-x-2 has-[>svg]:has-data-[slot=alert-action]:grid-cols-[auto_1fr_auto] *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
	variants: {
		/**
		 * Severity. `destructive` for an error the reader has to act on, `warning`
		 * for something that will bite later, `success` for a completed outcome;
		 * `default` is neutral information.
		 */
		variant: {
			default: "bg-card text-card-foreground",
			destructive:
				"bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
			success:
				"bg-card text-success *:data-[slot=alert-description]:text-success/90 *:[svg]:text-current",
			warning:
				"bg-card text-warning *:data-[slot=alert-description]:text-warning/90 *:[svg]:text-current",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});
