import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Gallery } from "@voila.dev/ui/gallery";

const images = [
	{
		src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
		alt: "Studio workspace",
	},
	{
		src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
		alt: "Team collaborating",
	},
	{
		src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
		alt: "Developer at work",
	},
	{
		src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
		alt: "Client meeting",
	},
];

const meta = {
	title: "UI/Gallery",
	component: Gallery.Root,
	tags: ["autodocs"],
	args: {
		images,
	},
} satisfies Meta<typeof Gallery.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

// Click a thumbnail to open the swipeable lightbox.
export const Default: Story = {};

export const SingleImage: Story = {
	args: {
		images: images.slice(0, 1),
	},
};

export const Empty: Story = {
	args: {
		images: [],
		emptyLabel: "No photos yet.",
		emptyDescription: "Add photos to showcase your work.",
	},
};
