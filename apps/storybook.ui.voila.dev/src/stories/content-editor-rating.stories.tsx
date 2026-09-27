import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ContentEditor, ratingFeature } from "@voila.dev/ui/content-editor";
import {
	CardEditor,
	noArgs,
	paragraph,
} from "./content-editor-card-fixtures.tsx";

const [rating] = ratingFeature.nodes;

const meta = {
	title: "ContentEditor/Blocks/Rating",
	component: ContentEditor.Root,
	parameters: { layout: "padded" },
	args: noArgs,
} satisfies Meta<typeof ContentEditor.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const question = {
	children: [
		{ text: "How was " },
		{ text: "Saturday's", bold: true },
		{ text: " training?" },
	],
	lowLabel: "Not great",
	highLabel: "Loved it",
	href: "https://example.com/survey",
};

/** Filled stars, the default. The question is typed and formatted in place. */
export const Filled: Story = {
	render: () => (
		<CardEditor
			initial={[
				paragraph("One question before you go:"),
				rating.createNode(question),
				paragraph("Thanks!"),
			]}
		/>
	),
};

/** Outlined stars. */
export const Outline: Story = {
	render: () => (
		<CardEditor
			initial={[
				rating.createNode({ ...question, style: "outline" }),
				paragraph(""),
			]}
		/>
	),
};

/** No scale labels: only the stars under the question. */
export const WithoutLabels: Story = {
	render: () => (
		<CardEditor
			initial={[
				rating.createNode({ ...question, lowLabel: "", highLabel: "" }),
				paragraph(""),
			]}
		/>
	),
};

/** Freshly inserted: the placeholder asks for the question. */
export const Empty: Story = {
	render: () => <CardEditor initial={[rating.createNode(), paragraph("")]} />,
};
