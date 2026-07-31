import { Chart } from "@voila.dev/ui/chart";
import { axes, both, Cartesian, LEGEND_MARGIN } from "./fixtures";

export const Area = () => (
	<Cartesian y={both} margin={LEGEND_MARGIN}>
		<Chart.Grid />
		{axes}
		<Chart.Cursor />
		<Chart.Area />
		<Chart.Tooltip />
		<Chart.Legend />
	</Cartesian>
);
