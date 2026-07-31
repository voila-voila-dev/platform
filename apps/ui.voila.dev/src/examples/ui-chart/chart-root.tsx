import { Chart } from "@voila.dev/ui/chart";
import { axes, both, Cartesian, LEGEND_MARGIN } from "./fixtures";

export const Bars = () => (
	<Cartesian y={both} margin={LEGEND_MARGIN}>
		<Chart.Grid />
		{axes}
		<Chart.Cursor />
		<Chart.Bars />
		<Chart.Tooltip />
		<Chart.Legend />
	</Cartesian>
);

export const Root = Bars;
