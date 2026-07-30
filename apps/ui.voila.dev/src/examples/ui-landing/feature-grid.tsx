import { CurrencyDollarIcon, PackageIcon } from "@phosphor-icons/react";
import { FeatureGrid } from "@voila.dev/ui/landing";

const features = [
	{
		icon: CurrencyDollarIcon,
		title: "Agency rates run high",
		description:
			"Hiring an agency for every small task drains the budget of growing teams.",
	},
	{
		icon: PackageIcon,
		title: "Skills always missing",
		description:
			"The expertise you need is never in-house at the moment you need it.",
	},
];

export function FeatureGridExample() {
	return (
		<FeatureGrid.Root tone="destructive" columns="2">
			{features.map((feature) => {
				const Icon = feature.icon;
				return (
					<FeatureGrid.Card key={feature.title}>
						<FeatureGrid.CardIcon>
							<Icon />
						</FeatureGrid.CardIcon>
						<FeatureGrid.CardTitle>{feature.title}</FeatureGrid.CardTitle>
						<FeatureGrid.CardDescription>
							{feature.description}
						</FeatureGrid.CardDescription>
					</FeatureGrid.Card>
				);
			})}
		</FeatureGrid.Root>
	);
}
