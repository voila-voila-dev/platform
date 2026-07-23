import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Gallery } from "@voila.dev/ui/components/gallery";

const images = [
	{
		src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80",
		alt: "Training session on the pitch",
	},
	{
		src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
		alt: "Athlete warming up",
	},
	{
		src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
		alt: "Weight room",
	},
	{
		src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
		alt: "Stadium at dusk",
	},
];

const meta = {
	title: "UI/Gallery",
	component: Gallery,
	tags: ["autodocs"],
	args: {
		images,
	},
} satisfies Meta<typeof Gallery>;

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
		emptyLabel: "Aucune photo pour le moment.",
		emptyDescription: "Ajoutez des photos pour présenter votre club.",
	},
};
