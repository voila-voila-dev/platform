import type * as React from "react";
import { cn } from "#/lib/utils.ts";

/**
 * Rendered in place of a chart when there is no data. Defaults to the root's
 * aspect-video box — size it like the chart it stands in for. Pass localized
 * content as children (plain text, or an `Empty` block).
 */
function ChartEmpty({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="chart-empty"
			className={cn(
				"flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-balance text-muted-foreground text-sm",
				className,
			)}
			{...props}
		/>
	);
}

export { ChartEmpty };
