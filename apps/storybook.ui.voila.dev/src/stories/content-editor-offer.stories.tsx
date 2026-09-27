import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ContentEditor, offerFeature } from "@voila.dev/ui/content-editor";
import {
	CARD_IMAGE,
	CardEditor,
	noArgs,
	paragraph,
} from "./content-editor-card-fixtures.tsx";

const [offer] = offerFeature.nodes;

const meta = {
	title: "ContentEditor/Blocks/Offer",
	component: ContentEditor.Root,
	parameters: { layout: "padded" },
	args: noArgs,
} satisfies Meta<typeof ContentEditor.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const club = {
	eyebrow: "Most popular",
	name: "Club",
	description: "Everything a club needs for a season.",
	price: { amountInMinorUnits: 1900, currency: "EUR" },
	period: "per month",
	features: ["Unlimited teams", "Match sheets", "Priority support"],
	buttonLabel: "Choose Club",
	buttonHref: "https://example.com/pricing/club",
};

/** A plan with its features and a button. */
export const Plain: Story = {
	render: () => (
		<CardEditor initial={[offer.createNode(club), paragraph("")]} />
	),
};

/** The recommended plan of a row, framed in the brand colour. */
export const Highlighted: Story = {
	render: () => (
		<CardEditor
			initial={[
				offer.createNode({ ...club, highlighted: true }),
				paragraph(""),
			]}
		/>
	),
};

/** With a visual above it. */
export const WithImage: Story = {
	render: () => (
		<CardEditor
			initial={[
				offer.createNode({
					...club,
					image: { src: CARD_IMAGE, alt: "Our coaches" },
				}),
				paragraph(""),
			]}
		/>
	),
};

/** A one-off price: no period, no eyebrow, no features. */
export const OneOff: Story = {
	render: () => (
		<CardEditor
			initial={[
				offer.createNode({
					name: "Summer camp",
					price: { amountInMinorUnits: 24000, currency: "EUR" },
					buttonLabel: "Book a place",
				}),
				paragraph(""),
			]}
		/>
	),
};

/** Freshly inserted. */
export const Empty: Story = {
	render: () => <CardEditor initial={[offer.createNode(), paragraph("")]} />,
};
