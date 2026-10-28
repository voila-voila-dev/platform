import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Card } from "@voila.dev/ui/card";
import { Section } from "@voila.dev/ui/section";

const meta = {
	title: "UI/Section",
	component: Section.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Section.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Section.Root>
			<Section.Header>
				<Section.Heading>
					<Section.Title>Upcoming projects</Section.Title>
					<Section.Description>
						Your team's projects this week.
					</Section.Description>
				</Section.Heading>
				<Section.Actions>
					<Button variant="ghost" size="sm">
						View all
					</Button>
				</Section.Actions>
			</Section.Header>
			<Card.Root>
				<Card.Content>Design review — Saturday June 14, 3:00 PM</Card.Content>
			</Card.Root>
		</Section.Root>
	),
};

export const TitleOnly: Story = {
	render: () => (
		<Section.Root>
			<Section.Header>
				<Section.Heading>
					<Section.Title>Documents</Section.Title>
				</Section.Heading>
			</Section.Header>
			<Card.Root>
				<Card.Content>Statement-of-work.pdf</Card.Content>
			</Card.Root>
		</Section.Root>
	),
};

/**
 * Sections stack on the page rhythm; pass `render` on the title to fit the
 * heading outline when sections nest.
 */
export const Stacked: Story = {
	render: () => (
		<div className="flex flex-col gap-10">
			<Section.Root>
				<Section.Header>
					<Section.Heading>
						<Section.Title>Profile</Section.Title>
						<Section.Description>
							Information visible to clients.
						</Section.Description>
					</Section.Heading>
				</Section.Header>
				<Card.Root>
					<Card.Content>Nathan Guyot — Full-stack developer</Card.Content>
				</Card.Root>
			</Section.Root>
			<Section.Root>
				<Section.Header>
					<Section.Heading>
						{/* biome-ignore lint/a11y/useHeadingContent: Base UI's render prop nests the Section.Title children inside the heading. */}
						<Section.Title render={<h3 />}>Certifications</Section.Title>
					</Section.Heading>
					<Section.Actions>
						<Button variant="outline" size="sm">
							Add
						</Button>
					</Section.Actions>
				</Section.Header>
				<Card.Root>
					<Card.Content>AWS Solutions Architect — Associate</Card.Content>
				</Card.Root>
			</Section.Root>
		</div>
	),
};
