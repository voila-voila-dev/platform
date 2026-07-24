import {
	ArrowRightIcon,
	BuildingsIcon,
	StethoscopeIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { Eyebrow } from "@voila.dev/ui-landing/components/eyebrow";
import {
	LandingHero,
	landingHeroLayoutOptions,
} from "@voila.dev/ui-landing/components/landing-hero";
import { StatsRow } from "@voila.dev/ui-landing/components/stats-row";
import { Fragment } from "react";
import { heroCopy, IllustrationPlaceholder } from "./landing-fixtures";

const meta = {
	title: "Landing/LandingHero",
	component: LandingHero.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		layout: {
			control: "select",
			options: landingHeroLayoutOptions,
		},
	},
} satisfies Meta<typeof LandingHero.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Reproduces the home hero of the original Astro site's `section-hero.astro`. */
export const HomeHero: Story = {
	render: () => (
		<LandingHero.Root>
			<LandingHero.Content>
				<Eyebrow.Root tone="brand" className="mb-6">
					<Eyebrow.Dot pulse />
					<Eyebrow.Label>{heroCopy.badge}</Eyebrow.Label>
				</Eyebrow.Root>

				<LandingHero.Title>
					{heroCopy.titleStart}{" "}
					<LandingHero.Highlight tone="brand">
						{heroCopy.titleHighlight}
					</LandingHero.Highlight>{" "}
					{heroCopy.titleMiddle}{" "}
					<LandingHero.Highlight tone="highlight">
						{heroCopy.titleHighlightEnd}
					</LandingHero.Highlight>{" "}
					{heroCopy.titleEnd}
				</LandingHero.Title>

				<LandingHero.Lead>{heroCopy.description}</LandingHero.Lead>

				<LandingHero.Actions>
					<Button size="lg" variant="highlight" className="group">
						<BuildingsIcon className="h-5 w-5" />
						{heroCopy.ctaClient}
						<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Button>
					<Button size="lg" variant="brand" className="group">
						<StethoscopeIcon className="h-5 w-5" />
						{heroCopy.ctaFreelancer}
						<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Button>
				</LandingHero.Actions>

				<StatsRow.Root>
					{heroCopy.stats.map((stat, index) => (
						<Fragment key={stat.label}>
							{index > 0 ? <StatsRow.Divider /> : null}
							<StatsRow.Item>
								<StatsRow.Value>{stat.value}</StatsRow.Value>
								<StatsRow.Label>{stat.label}</StatsRow.Label>
							</StatsRow.Item>
						</Fragment>
					))}
				</StatsRow.Root>
			</LandingHero.Content>

			<LandingHero.Media>
				<IllustrationPlaceholder label="HeroIllustration (app-side)" />
			</LandingHero.Media>
		</LandingHero.Root>
	),
};

export const Centered: Story = {
	render: () => (
		<LandingHero.Root layout="centered" background="gradient-primary">
			<LandingHero.Content className="text-center">
				<LandingHero.Title>
					Rejoignez le{" "}
					<LandingHero.Highlight tone="primary">
						mouvement
					</LandingHero.Highlight>
				</LandingHero.Title>
				<LandingHero.Lead className="mx-auto">
					{heroCopy.description}
				</LandingHero.Lead>
				<LandingHero.Actions className="justify-center">
					<Button size="lg" variant="primary">
						{heroCopy.ctaClient}
					</Button>
				</LandingHero.Actions>
			</LandingHero.Content>
		</LandingHero.Root>
	),
};
