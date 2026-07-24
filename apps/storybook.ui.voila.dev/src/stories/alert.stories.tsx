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
			<AlertTitle>Project updated</AlertTitle>
			<AlertDescription>
				The client moved Friday's review to 3:00 PM. Your booking follows
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
				project booked.
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
				Camille Dubois will start the project on Monday, June 22.
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
				Submit the project report within 48 hours to release the payment.
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
				Applications close 24 hours before the project starts.
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
				You withdrew your application for the website redesign project.
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
				We could not charge your card for this project.
			</AlertDescription>
			<AlertAction>
				<Button variant="outline" size="xs">
					Withdraw application
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
				You can now message clients directly from a project page.
			</AlertDescription>
			<AlertClose />
		</Alert>
	),
};
