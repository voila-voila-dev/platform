import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { UserAvatar } from "@voila.dev/ui/components/user-avatar";

const meta = {
	title: "UI/UserAvatar",
	component: UserAvatar,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "lg"],
		},
		status: {
			control: "select",
			options: [undefined, "online", "offline", "busy"],
		},
	},
	args: {
		name: "Camille Dubois",
		description: "Kinésithérapeute du sport",
		src: "https://github.com/shadcn.png",
		size: "default",
	},
} satisfies Meta<typeof UserAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NameOnly: Story = {
	args: {
		description: undefined,
	},
};

export const InitialsFallback: Story = {
	args: {
		src: undefined,
	},
};

export const WithStatus: Story = {
	args: {
		status: "online",
	},
};

export const Sizes: Story = {
	render: (args) => (
		<div className="flex flex-col items-start gap-4">
			<UserAvatar {...args} size="sm" />
			<UserAvatar {...args} size="default" />
			<UserAvatar {...args} size="lg" />
		</div>
	),
};

export const ParticipantList: Story = {
	render: () => (
		<div className="flex max-w-xs flex-col gap-3">
			<UserAvatar
				name="Camille Dubois"
				description="Kinésithérapeute du sport"
				src="https://github.com/shadcn.png"
				status="online"
			/>
			<UserAvatar
				name="Nathan Guyot"
				description="Stade Rochelais"
				src="https://github.com/leerob.png"
				status="busy"
			/>
			<UserAvatar name="Léa Martin" description="Ostéopathe" status="offline" />
		</div>
	),
};

export const Truncation: Story = {
	render: () => (
		<div className="w-44 rounded-lg border p-2">
			<UserAvatar
				name="Camille Dubois de la Rochefoucauld"
				description="Kinésithérapeute du sport et ostéopathe"
			/>
		</div>
	),
};
