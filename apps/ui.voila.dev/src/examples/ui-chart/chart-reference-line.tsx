import { Chart } from "@voila.dev/ui/chart";
import { axes, Cartesian } from "./fixtures";

export const ReferenceLine = () => (
	<Cartesian>
		<Chart.Grid />
		{axes}
		<Chart.Line />
		<Chart.ReferenceLine value={30} label="Target" />
	</Cartesian>
);
