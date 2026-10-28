import { BriefcaseIcon, BuildingsIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/button";
import {
	Eyebrow as EyebrowParts,
	LandingHero,
	StatsRow,
} from "@voila.dev/ui/landing";
import { Fragment } from "react";
import { IllustrationPlaceholder, stats } from "./fixtures";

export function Hero() {
	return (
		<LandingHero.Root>
			<LandingHero.Content>
				<EyebrowParts.Root tone="brand" className="mb-6">
					<EyebrowParts.Dot pulse />
					<EyebrowParts.Label>New platform</EyebrowParts.Label>
				</EyebrowParts.Root>
				<LandingHero.Title>
					Find a{" "}
					<LandingHero.Highlight tone="brand">
						trusted freelancer
					</LandingHero.Highlight>{" "}
					for your{" "}
					<LandingHero.Highlight tone="highlight">
						next project
					</LandingHero.Highlight>
				</LandingHero.Title>
				<LandingHero.Lead>
					The platform that connects client teams with independent freelancers.
				</LandingHero.Lead>
				<LandingHero.Actions>
					<Button size="lg" variant="highlight">
						<BuildingsIcon /> I'm a client
					</Button>
					<Button size="lg" variant="brand">
						<BriefcaseIcon /> I'm a freelancer
					</Button>
				</LandingHero.Actions>
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
			</LandingHero.Content>
			<LandingHero.Media>
				<IllustrationPlaceholder label="Illustration (app-side)" />
			</LandingHero.Media>
		</LandingHero.Root>
	);
}

export function HeroCentered() {
	return (
		<LandingHero.Root layout="centered" background="gradient-primary">
			<LandingHero.Content className="text-center">
				<LandingHero.Title>
					Join the{" "}
					<LandingHero.Highlight tone="primary">movement</LandingHero.Highlight>
				</LandingHero.Title>
				<LandingHero.Lead className="mx-auto">
					Client or freelancer, there is a place for you.
				</LandingHero.Lead>
				<LandingHero.Actions className="justify-center">
					<Button size="lg" variant="primary">
						Get started
					</Button>
				</LandingHero.Actions>
			</LandingHero.Content>
		</LandingHero.Root>
	);
}
