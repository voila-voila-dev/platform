import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import { ProfileHeader } from "@voila.dev/ui/components/profile-header";

const COVER_IMAGE =
	"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80";

const meta = {
	title: "UI/ProfileHeader",
	component: ProfileHeader,
	tags: ["autodocs"],
	argTypes: {
		theme: {
			control: "select",
			options: ["provider", "organization"],
		},
	},
	args: {
		name: "Camille Dubois",
		headline: "Kinésithérapeute du sport",
		theme: "provider",
		className: "w-full max-w-2xl rounded-xl border",
	},
} satisfies Meta<typeof ProfileHeader>;

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
				<Badge variant="provider">Identité vérifiée</Badge>
				<Badge variant="secondary">Kinésithérapie</Badge>
			</>
		),
		actions: <Button size="sm">Contacter</Button>,
	},
};

export const OrganizationTheme: Story = {
	args: {
		name: "Stade Rochelais",
		headline: "Club de rugby — La Rochelle",
		theme: "organization",
		badges: <Badge variant="organization">Club vérifié</Badge>,
	},
};
