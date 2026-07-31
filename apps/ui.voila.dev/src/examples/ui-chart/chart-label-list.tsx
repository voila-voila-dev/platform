import { Chart } from "@voila.dev/ui/chart";
import { axes, Cartesian } from "./fixtures";

export const LabelList = () => (
	<Cartesian margin={{ top: 20, right: 8, bottom: 28, left: 40 }}>
		{axes}
		<Chart.Bars />
		<Chart.LabelList marks="bars" />
	</Cartesian>
);
