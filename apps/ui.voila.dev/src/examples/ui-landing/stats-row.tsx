import { StatsRow } from "@voila.dev/ui/landing";
import { Fragment } from "react";
import { stats } from "./fixtures";

export function Default() {
	return (
		<StatsRow.Root>
			{stats.map((stat, index) => (
				<Fragment key={stat.label}>
					{index > 0 ? <StatsRow.Divider /> : null}
					<StatsRow.Item>
						<StatsRow.Value>{stat.value}</StatsRow.Value>
						<StatsRow.Label>{stat.label}</StatsRow.Label>
					</StatsRow.Item>
				</Fragment>
			))}
		</StatsRow.Root>
	);
}
