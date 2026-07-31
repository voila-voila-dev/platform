import { Chart } from "@voila.dev/ui/chart";
import { axes, Cartesian } from "./fixtures";

export const Line = () => (
	<Cartesian>
		<Chart.Grid />
		{axes}
		<Chart.Cursor />
		<Chart.Line />
		<Chart.Tooltip />
	</Cartesian>
);

export const XAxis = Line;
