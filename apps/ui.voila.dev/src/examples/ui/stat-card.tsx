import { StatCard } from "@voila.dev/ui/stat-card";

export function StatCardExample() {
	return (
		<div className="grid w-full gap-4 sm:grid-cols-2">
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Projects published</StatCard.Label>
				</StatCard.Header>
				<StatCard.Value>38</StatCard.Value>
				<StatCard.Delta trend="up">+12% vs. last month</StatCard.Delta>
			</StatCard.Root>
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Cancellations</StatCard.Label>
				</StatCard.Header>
				<StatCard.Value>17</StatCard.Value>
				<StatCard.Delta trend="down">-8% vs. last month</StatCard.Delta>
			</StatCard.Root>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Item and List                                                              */
/* -------------------------------------------------------------------------- */
