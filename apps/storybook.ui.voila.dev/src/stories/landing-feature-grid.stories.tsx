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
		title: "Des prix pharmacie élevés",
		description:
			"Le matériel médical acheté à l'unité en pharmacie grève le budget des clubs amateurs.",
	},
	{
		icon: PackageIcon,
		title: "Des trousses incomplètes",
		description:
			"Strapping, froid, désinfection : il manque toujours l'essentiel au moment où on en a besoin.",
	},
	{
		icon: ShieldWarningIcon,
		title: "Des sportifs mal protégés",
		description:
			"Sans matériel adapté, les blessures sont mal prises en charge au bord du terrain.",
	},
];

/** Reproduces the original Astro site's `section-equipment-pains.astro`. */
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
