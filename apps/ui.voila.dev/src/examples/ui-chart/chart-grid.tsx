import { Chart } from "@voila.dev/ui/chart";
import { axes, Cartesian } from "./fixtures";

export const Grid = () => (
	<Cartesian>
		<Chart.Grid horizontal vertical />
		{axes}
		<Chart.Line />
	</Cartesian>
);
