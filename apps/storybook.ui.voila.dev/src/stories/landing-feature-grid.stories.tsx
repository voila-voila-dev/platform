import {
	CurrencyEurIcon,
	PackageIcon,
	ShieldWarningIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	FeatureGrid,
	featureGridCardVariantOptions,
	featureGridColumnsOptions,
} from "@voila.dev/ui-landing/components/feature-grid";
import { toneOptions } from "@voila.dev/ui-landing/lib/tones";

const meta = {
	title: "Landing/FeatureGrid",
	component: FeatureGrid.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		tone: {
			control: "select",
			options: toneOptions,
		},
		columns: {
			control: "select",
			options: featureGridColumnsOptions,
		},
	},
	args: {
		tone: "destructive",
	},
} satisfies Meta<typeof FeatureGrid.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const pains = [
	{
		icon: CurrencyEurIcon,
		title: "High agency markups",
		description:
			"Booking one-off help through agencies drains the budget of small client teams.",
	},
	{
		icon: PackageIcon,
		title: "Incomplete briefs",
		description:
			"Scope, assets, access: the essentials are always missing right when the work should start.",
	},
	{
		icon: ShieldWarningIcon,
		title: "Launches left exposed",
		description:
			"Without the right expert on hand, projects get patched together at the last minute.",
	},
];

/** Reproduces the original Astro site's hiring-pains section. */
export const Default: Story = {
	render: (args) => (
		<FeatureGrid.Root {...args}>
			{pains.map((pain, index) => {
				const Icon = pain.icon;
				return (
					<div
						key={pain.title}
						className="animate-fade-up"
						style={{ animationDelay: `${index * 0.15}s` }}
					>
						<FeatureGrid.Card>
							<FeatureGrid.CardIcon>
								<Icon />
							</FeatureGrid.CardIcon>
							<FeatureGrid.CardTitle>{pain.title}</FeatureGrid.CardTitle>
							<FeatureGrid.CardDescription>
								{pain.description}
							</FeatureGrid.CardDescription>
						</FeatureGrid.Card>
					</div>
				);
			})}
		</FeatureGrid.Root>
	),
};

export const CardVariants: Story = {
	render: () => (
		<div className="space-y-8">
			{featureGridCardVariantOptions.map((variant) => (
				<FeatureGrid.Root key={variant} tone="primary" columns="2">
					{pains.slice(0, 2).map((pain) => {
						const Icon = pain.icon;
						return (
							<FeatureGrid.Card key={pain.title} variant={variant}>
								<FeatureGrid.CardIcon>
									<Icon />
								</FeatureGrid.CardIcon>
								<FeatureGrid.CardTitle>
									{pain.title} ({variant})
								</FeatureGrid.CardTitle>
								<FeatureGrid.CardDescription>
									{pain.description}
								</FeatureGrid.CardDescription>
							</FeatureGrid.Card>
						);
					})}
				</FeatureGrid.Root>
			))}
		</div>
	),
};
