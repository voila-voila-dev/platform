import { ArrowRightIcon, BuildingsIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/button";
import {
	ComparisonSection,
	Eyebrow as EyebrowParts,
	Heading as HeadingComponent,
} from "@voila.dev/ui/landing";
import { IllustrationPlaceholder } from "./fixtures";

const withoutItems = [
	"Weeks lost sourcing candidates for one task",
	"A contractor found in a rush, never vetted",
	"No follow-up once the work is delivered",
];

const withItems = [
	"A verified freelancer ready when the project starts",
	"A complete, professional toolkit from day one",
	"Zero overhead on contracts or invoicing",
];

export function Default() {
	return (
		<ComparisonSection.Root tone="highlight" background="muted">
			<ComparisonSection.Content>
				<EyebrowParts.Root tone="highlight" className="mb-4">
					<EyebrowParts.Icon>
						<BuildingsIcon />
					</EyebrowParts.Icon>
					<EyebrowParts.Label>For client teams</EyebrowParts.Label>
				</EyebrowParts.Root>
				<HeadingComponent className="mb-8">
					Your roadmap keeps moving.{" "}
					<span className="text-highlight">Hiring shouldn't slow it.</span>
				</HeadingComponent>
				<ComparisonSection.Panels>
					<ComparisonSection.Panel variant="without">
						<ComparisonSection.PanelTitle>
							Traditional hiring
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{withoutItems.map((item) => (
								<ComparisonSection.PanelItem key={item}>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>
					<ComparisonSection.Panel variant="with">
						<ComparisonSection.PanelTitle>
							With Acme
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{withItems.map((item) => (
								<ComparisonSection.PanelItem key={item}>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>
				</ComparisonSection.Panels>
				<ComparisonSection.TagList>
					{["Design", "Development", "Copywriting"].map((tag) => (
						<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
					))}
				</ComparisonSection.TagList>
				<Button size="lg" variant="highlight">
					Find a freelancer <ArrowRightIcon />
				</Button>
			</ComparisonSection.Content>
			<ComparisonSection.Media>
				<IllustrationPlaceholder label="Illustration (app-side)" />
			</ComparisonSection.Media>
		</ComparisonSection.Root>
	);
}
