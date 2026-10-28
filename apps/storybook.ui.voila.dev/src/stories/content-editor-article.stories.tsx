import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { articleFeature, ContentEditor } from "@voila.dev/ui/content-editor";
import {
	CARD_IMAGE,
	CardEditor,
	noArgs,
	paragraph,
} from "./content-editor-card-fixtures.tsx";

const [article] = articleFeature.nodes;

const meta = {
	title: "ContentEditor/Blocks/Article",
	component: ContentEditor.Root,
	parameters: { layout: "padded" },
	args: noArgs,
} satisfies Meta<typeof ContentEditor.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Every field filled: the visual, the byline, the summary and the link. */
export const Complete: Story = {
	render: () => (
		<CardEditor
			initial={[
				paragraph("This month on the blog:"),
				article.createNode({
					title: "Meet the coach who runs our Saturday sessions",
					description:
						"Ana has coached for twelve years. She tells us how she plans a season.",
					image: { src: CARD_IMAGE, alt: "Ana on the pitch" },
					author: "Ana Lima",
					publishDate: "2026-07-20",
					href: "https://example.com/blog/meet-the-coach",
				}),
				paragraph(""),
			]}
		/>
	),
};

/** No visual, no byline: the card keeps its image slot as a placeholder. */
export const Minimal: Story = {
	render: () => (
		<CardEditor
			initial={[
				article.createNode({
					title: "Our new opening hours",
					description: "From September, doors open at 8:00.",
				}),
				paragraph(""),
			]}
		/>
	),
};

/** Freshly inserted: the placeholders say what goes where. */
export const Empty: Story = {
	render: () => <CardEditor initial={[article.createNode(), paragraph("")]} />,
};

/** The same card in a page of prose rather than the email card. */
export const InADocument: Story = {
	render: () => (
		<CardEditor
			appearance="document"
			initial={[
				article.createNode({
					title: "Meet the coach",
					description: "Ana tells us how she plans a season.",
					image: { src: CARD_IMAGE, alt: "" },
					author: "Ana Lima",
					publishDate: "2026-07-20",
				}),
				paragraph(""),
			]}
		/>
	),
};
