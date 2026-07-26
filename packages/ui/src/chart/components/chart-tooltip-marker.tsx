import type { ChartTooltipIndicator } from "#/chart/core/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props {
	readonly indicator: ChartTooltipIndicator;
	readonly color: string;
}

const indicatorClassNames: Record<ChartTooltipIndicator, string> = {
	dot: "h-2.5 w-2.5 rounded-[2px]",
	line: "h-2.5 w-1 rounded-[2px]",
	dashed: "h-2.5 w-0 border-[1.5px] border-dashed bg-transparent",
};

/** The series swatch in front of a tooltip row. */
export function ChartTooltipMarker({ indicator, color }: Props) {
	return (
		<div
			data-slot="chart-tooltip-marker"
			className={cn("shrink-0", indicatorClassNames[indicator])}
			style={{ backgroundColor: color, borderColor: color }}
		/>
	);
}
