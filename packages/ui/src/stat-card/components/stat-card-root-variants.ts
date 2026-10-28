import { cva } from "#/lib/cva.ts";

export const statCardRootVariants = cva({
	base: "gap-1.5",
	variants: {
		/**
		 * Health of the metric against its objective. The tint goes on the frame,
		 * not the value, so the number stays readable and a scan of the grid shows
		 * where the fires are: `alerting` renders a destructive frame,
		 * `below-objective` a warning one, `on-track` keeps the default frame.
		 */
		status: {
			"on-track": "",
			"below-objective": "border border-warning/50 bg-warning/5 ring-0",
			alerting: "border border-destructive/50 bg-destructive/5 ring-0",
		},
	},
});
