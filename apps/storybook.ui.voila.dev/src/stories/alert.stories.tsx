import {
	CheckCircleIcon,
	InfoIcon,
	WarningCircleIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Alert } from "@voila.dev/ui/alert";
import { Button } from "@voila.dev/ui/button";

const meta = {
	title: "UI/Alert",
	component: Alert.Root,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "destructive", "success", "warning"],
		},
	},
	args: {
		variant: "default",
	},
} satisfies Meta<typeof Alert.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<InfoIcon />
			<Alert.Title>Project updated</Alert.Title>
			<Alert.Description>
				The client moved Friday's review to 3:00 PM. Your booking follows
				automatically.
			</Alert.Description>
		</Alert.Root>
	),
};

export const Destructive: Story = {
	args: { variant: "destructive" },
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<WarningCircleIcon />
			<Alert.Title>Payment failed</Alert.Title>
			<Alert.Description>
				We could not charge your card. Update your payment method to keep the
				project booked.
			</Alert.Description>
		</Alert.Root>
	),
};

export const Success: Story = {
	args: { variant: "success" },
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<CheckCircleIcon />
			<Alert.Title>Booking confirmed</Alert.Title>
			<Alert.Description>
				Camille Dubois will start the project on Monday, June 22.
			</Alert.Description>
		</Alert.Root>
	),
};

export const Warning: Story = {
	args: { variant: "warning" },
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<WarningIcon />
			<Alert.Title>Report due soon</Alert.Title>
			<Alert.Description>
				Submit the project report within 48 hours to release the payment.
			</Alert.Description>
		</Alert.Root>
	),
};

export const TitleOnly: Story = {
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<CheckCircleIcon />
			<Alert.Title>Profile saved</Alert.Title>
		</Alert.Root>
	),
};

export const DescriptionOnly: Story = {
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<Alert.Description>
				Applications close 24 hours before the project starts.
			</Alert.Description>
		</Alert.Root>
	),
};

export const WithLink: Story = {
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<InfoIcon />
			<Alert.Title>Stripe account incomplete</Alert.Title>
			<Alert.Description>
				Finish your <a href="#stripe">Stripe onboarding</a> to receive payouts.
			</Alert.Description>
		</Alert.Root>
	),
};

export const WithAction: Story = {
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<Alert.Title>Application withdrawn</Alert.Title>
			<Alert.Description>
				You withdrew your application for the website redesign project.
			</Alert.Description>
			<Alert.Action>
				<Button variant="outline" size="xs">
					Undo
				</Button>
			</Alert.Action>
		</Alert.Root>
	),
};

export const DestructiveWithAction: Story = {
	args: { variant: "destructive" },
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<WarningCircleIcon />
			<Alert.Title>Payment failed</Alert.Title>
			<Alert.Description>
				We could not charge your card for this project.
			</Alert.Description>
			<Alert.Action>
				<Button variant="outline" size="xs">
					Withdraw application
				</Button>
			</Alert.Action>
		</Alert.Root>
	),
};

export const Dismissible: Story = {
	render: (args) => (
		<Alert.Root {...args} className="max-w-md">
			<InfoIcon />
			<Alert.Title>New feature</Alert.Title>
			<Alert.Description>
				You can now message clients directly from a project page.
			</Alert.Description>
			<Alert.Close />
		</Alert.Root>
	),
};
