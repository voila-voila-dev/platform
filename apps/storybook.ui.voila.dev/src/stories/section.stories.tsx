import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { Card, CardContent } from "@voila.dev/ui/components/card";
import {
	Section,
	SectionActions,
	SectionDescription,
	SectionHeader,
	SectionHeading,
	SectionTitle,
} from "@voila.dev/ui/components/section";

const meta = {
	title: "UI/Section",
	component: Section,
	tags: ["autodocs"],
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Section>
			<SectionHeader>
				<SectionHeading>
					<SectionTitle>Upcoming projects</SectionTitle>
					<SectionDescription>
						Your team's projects this week.
					</SectionDescription>
				</SectionHeading>
				<SectionActions>
					<Button variant="ghost" size="sm">
						View all
					</Button>
				</SectionActions>
			</SectionHeader>
			<Card>
				<CardContent>Design review — Saturday June 14, 3:00 PM</CardContent>
			</Card>
		</Section>
	),
};

export const TitleOnly: Story = {
	render: () => (
		<Section>
			<SectionHeader>
				<SectionHeading>
					<SectionTitle>Documents</SectionTitle>
				</SectionHeading>
			</SectionHeader>
			<Card>
				<CardContent>Statement-of-work.pdf</CardContent>
			</Card>
		</Section>
	),
};

/**
 * Sections stack on the page rhythm; pass `render` on the title to fit the
 * heading outline when sections nest.
 */
export const Stacked: Story = {
	render: () => (
		<div className="flex flex-col gap-10">
			<Section>
				<SectionHeader>
					<SectionHeading>
						<SectionTitle>Profile</SectionTitle>
						<SectionDescription>
							Information visible to clients.
						</SectionDescription>
					</SectionHeading>
				</SectionHeader>
				<Card>
					<CardContent>Nathan Guyot — Full-stack developer</CardContent>
				</Card>
			</Section>
			<Section>
				<SectionHeader>
					<SectionHeading>
						{/* biome-ignore lint/a11y/useHeadingContent: Base UI's render prop nests the SectionTitle children inside the heading. */}
						<SectionTitle render={<h3 />}>Certifications</SectionTitle>
					</SectionHeading>
					<SectionActions>
						<Button variant="outline" size="sm">
							Add
						</Button>
					</SectionActions>
				</SectionHeader>
				<Card>
					<CardContent>AWS Solutions Architect — Associate</CardContent>
				</Card>
			</Section>
		</div>
	),
};
