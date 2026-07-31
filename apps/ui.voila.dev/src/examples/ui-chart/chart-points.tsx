import { Chart } from "@voila.dev/ui/chart";
import { axes, Cartesian } from "./fixtures";

export const Points = () => (
	<Cartesian>
		<Chart.Grid />
		{axes}
		<Chart.Line />
		<Chart.Points />
		<Chart.Tooltip />
	</Cartesian>
);
