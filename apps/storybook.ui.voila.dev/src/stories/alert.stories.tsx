import {
	CheckCircleIcon,
	InfoIcon,
	WarningCircleIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Alert,
	AlertAction,
	AlertClose,
	AlertDescription,
	AlertTitle,
} from "@voila.dev/ui/components/alert";
import { Button } from "@voila.dev/ui/components/button";

const meta = {
	title: "UI/Alert",
	component: Alert,
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
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<InfoIcon />
			<AlertTitle>Mission updated</AlertTitle>
			<AlertDescription>
				The club moved Saturday's match to 3:00 PM. Your booking follows
				automatically.
			</AlertDescription>
		</Alert>
	),
};

export const Destructive: Story = {
	args: { variant: "destructive" },
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<WarningCircleIcon />
			<AlertTitle>Payment failed</AlertTitle>
			<AlertDescription>
				We could not charge your card. Update your payment method to keep the
				mission booked.
			</AlertDescription>
		</Alert>
	),
};

export const Success: Story = {
	args: { variant: "success" },
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<CheckCircleIcon />
			<AlertTitle>Booking confirmed</AlertTitle>
			<AlertDescription>
				Camille Dubois will cover the match on Saturday, June 20.
			</AlertDescription>
		</Alert>
	),
};

export const Warning: Story = {
	args: { variant: "warning" },
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<WarningIcon />
			<AlertTitle>Report due soon</AlertTitle>
			<AlertDescription>
				Submit the mission report within 48 hours to release the payment.
			</AlertDescription>
		</Alert>
	),
};

export const TitleOnly: Story = {
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<CheckCircleIcon />
			<AlertTitle>Profile saved</AlertTitle>
		</Alert>
	),
};

export const DescriptionOnly: Story = {
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<AlertDescription>
				Bookings close 24 hours before the event starts.
			</AlertDescription>
		</Alert>
	),
};

export const WithLink: Story = {
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<InfoIcon />
			<AlertTitle>Stripe account incomplete</AlertTitle>
			<AlertDescription>
				Finish your <a href="#stripe">Stripe onboarding</a> to receive payouts.
			</AlertDescription>
		</Alert>
	),
};

export const WithAction: Story = {
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<AlertTitle>Application withdrawn</AlertTitle>
			<AlertDescription>
				You withdrew your application for the tournament coverage mission.
			</AlertDescription>
			<AlertAction>
				<Button variant="outline" size="xs">
					Undo
				</Button>
			</AlertAction>
		</Alert>
	),
};

export const DestructiveWithAction: Story = {
	args: { variant: "destructive" },
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<WarningCircleIcon />
			<AlertTitle>Payment failed</AlertTitle>
			<AlertDescription>
				We could not charge your card for this mission.
			</AlertDescription>
			<AlertAction>
				<Button variant="outline" size="xs">
					Annuler la candidature
				</Button>
			</AlertAction>
		</Alert>
	),
};

export const Dismissible: Story = {
	render: (args) => (
		<Alert {...args} className="max-w-md">
			<InfoIcon />
			<AlertTitle>New feature</AlertTitle>
			<AlertDescription>
				You can now message clubs directly from a mission page.
			</AlertDescription>
			<AlertClose />
		</Alert>
	),
};
