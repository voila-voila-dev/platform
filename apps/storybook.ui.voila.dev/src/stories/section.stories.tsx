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
					<SectionTitle>Prochaines missions</SectionTitle>
					<SectionDescription>
						Les missions de votre club cette semaine.
					</SectionDescription>
				</SectionHeading>
				<SectionActions>
					<Button variant="ghost" size="sm">
						Voir tout
					</Button>
				</SectionActions>
			</SectionHeader>
			<Card>
				<CardContent>Match senior — samedi 14 juin, 15h00</CardContent>
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
				<CardContent>Attestation d'assurance.pdf</CardContent>
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
						<SectionTitle>Profil</SectionTitle>
						<SectionDescription>
							Informations visibles par les clubs.
						</SectionDescription>
					</SectionHeading>
				</SectionHeader>
				<Card>
					<CardContent>Nathan Guyot — Kinésithérapeute</CardContent>
				</Card>
			</Section>
			<Section>
				<SectionHeader>
					<SectionHeading>
						{/* biome-ignore lint/a11y/useHeadingContent: Base UI's render prop nests the SectionTitle children inside the heading. */}
						<SectionTitle render={<h3 />}>Qualifications</SectionTitle>
					</SectionHeading>
					<SectionActions>
						<Button variant="outline" size="sm">
							Ajouter
						</Button>
					</SectionActions>
				</SectionHeader>
				<Card>
					<CardContent>Urgence terrain — niveau 2</CardContent>
				</Card>
			</Section>
		</div>
	),
};
