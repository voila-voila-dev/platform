import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Badge } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";
import { ProfileHeader } from "@voila.dev/ui/profile-header";

const COVER_IMAGE =
	"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80";

const meta = {
	title: "UI/ProfileHeader",
	component: ProfileHeader.Root,
	tags: ["autodocs"],
	argTypes: {
		theme: {
			control: "select",
			options: ["brand", "highlight"],
		},
	},
	args: {
		name: "Camille Dubois",
		headline: "Senior product designer",
		theme: "brand",
		className: "w-full max-w-2xl rounded-xl border",
	},
} satisfies Meta<typeof ProfileHeader.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

// No cover image and no avatar src: themed gradient + initials fallback.
export const Default: Story = {};

export const WithCoverAndAvatar: Story = {
	args: {
		coverImage: COVER_IMAGE,
		avatar: { src: "https://github.com/shadcn.png", name: "Camille Dubois" },
	},
};

export const WithBadgesAndActions: Story = {
	args: {
		avatar: { src: "https://github.com/shadcn.png", name: "Camille Dubois" },
		badges: (
			<>
				<Badge variant="brand">Verified freelancer</Badge>
				<Badge variant="secondary">Product design</Badge>
			</>
		),
		actions: <Button size="sm">Contact</Button>,
	},
};

export const ClientTheme: Story = {
	args: {
		name: "Northwind Studio",
		headline: "Design agency — Amsterdam",
		theme: "highlight",
		badges: <Badge variant="highlight">Verified client</Badge>,
	},
};
