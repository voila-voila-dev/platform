import type { ComponentProps } from "react";
import { ChartPie } from "#/chart/components/chart-pie.tsx";

interface Props extends ComponentProps<typeof ChartPie> {}

/** A pie with its middle cut out — room for a total, and easier to compare. */
export function ChartDonut({ innerRadiusRatio = 0.6, ...props }: Props) {
	return <ChartPie innerRadiusRatio={innerRadiusRatio} {...props} />;
}
