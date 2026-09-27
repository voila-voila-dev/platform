import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ContentEditor, productFeature } from "@voila.dev/ui/content-editor";
import {
	CARD_IMAGE,
	CardEditor,
	noArgs,
	paragraph,
} from "./content-editor-card-fixtures.tsx";

const [product] = productFeature.nodes;

const meta = {
	title: "ContentEditor/Blocks/Product",
	component: ContentEditor.Root,
	parameters: { layout: "padded" },
	args: noArgs,
} satisfies Meta<typeof ContentEditor.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const jersey = {
	name: "Home jersey 2026",
	description: "Breathable mesh, club crest embroidered on the chest.",
	image: { src: CARD_IMAGE, alt: "The home jersey" },
	price: { amountInMinorUnits: 4900, currency: "EUR" },
	href: "https://example.com/shop/jersey",
	buttonLabel: "Order now",
};

/** At its price, with a button. */
export const Priced: Story = {
	render: () => (
		<CardEditor initial={[product.createNode(jersey), paragraph("")]} />
	),
};

/** Discounted: the base price struck through beside the price. */
export const Discounted: Story = {
	render: () => (
		<CardEditor
			initial={[
				product.createNode({
					...jersey,
					price: { amountInMinorUnits: 3900, currency: "EUR" },
					compareAtPrice: { amountInMinorUnits: 4900, currency: "EUR" },
				}),
				paragraph(""),
			]}
		/>
	),
};

/** No button label: the card has no call to action. In dollars. */
export const WithoutButton: Story = {
	render: () => (
		<CardEditor
			initial={[
				product.createNode({
					...jersey,
					price: { amountInMinorUnits: 5500, currency: "USD" },
					buttonLabel: "",
				}),
				paragraph(""),
			]}
		/>
	),
};

/** Freshly inserted. */
export const Empty: Story = {
	render: () => <CardEditor initial={[product.createNode(), paragraph("")]} />,
};
