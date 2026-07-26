import { MegaphoneIcon, WarningIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Banner } from "@voila.dev/ui/banner";
import { Button } from "@voila.dev/ui/button";
import { useState } from "react";

const meta = {
	title: "UI/Banner",
	component: Banner.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "muted", "success", "warning", "destructive"],
		},
	},
	args: {
		variant: "default",
	},
} satisfies Meta<typeof Banner.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Banner.Root {...args}>
			<MegaphoneIcon />
			<Banner.Title>
				Messaging is here — chat with clients directly from a project page.
			</Banner.Title>
			<Banner.Close />
		</Banner.Root>
	),
};

export const Muted: Story = {
	args: { variant: "muted" },
	render: (args) => (
		<Banner.Root {...args}>
			<Banner.Title>
				Scheduled maintenance Sunday from 2 AM to 4 AM — the platform will be
				unavailable.
			</Banner.Title>
			<Banner.Close />
		</Banner.Root>
	),
};

export const Success: Story = {
	args: { variant: "success" },
	render: (args) => (
		<Banner.Root {...args}>
			<Banner.Title>
				Your profile is complete — you can now apply to projects.
			</Banner.Title>
			<Banner.Close />
		</Banner.Root>
	),
};

export const Warning: Story = {
	args: { variant: "warning" },
	render: (args) => (
		<Banner.Root {...args}>
			<WarningIcon />
			<Banner.Title>
				Your Stripe account is incomplete — finish the setup to receive your
				payouts.
			</Banner.Title>
		</Banner.Root>
	),
};

export const Destructive: Story = {
	args: { variant: "destructive" },
	render: (args) => (
		<Banner.Root {...args}>
			<WarningIcon />
			<Banner.Title>
				Your subscription payment failed — update your payment method.
			</Banner.Title>
		</Banner.Root>
	),
};

export const WithAction: Story = {
	render: (args) => (
		<Banner.Root {...args}>
			<MegaphoneIcon />
			<Banner.Title>
				Messaging is here — chat with clients directly.
			</Banner.Title>
			<Banner.Action>
				<Button
					variant="outline"
					size="xs"
					className="border-current/30 bg-transparent text-current hover:bg-current/10 hover:text-current"
				>
					Learn more
				</Button>
			</Banner.Action>
			<Banner.Close />
		</Banner.Root>
	),
};

export const WithLink: Story = {
	args: { variant: "warning" },
	render: (args) => (
		<Banner.Root {...args}>
			<WarningIcon />
			<Banner.Title>
				Submit the <a href="#report">project report</a> within 48 hours to
				release the payment.
			</Banner.Title>
		</Banner.Root>
	),
};

export const Dismissible: Story = {
	render: function DismissibleStory(args) {
		const [open, setOpen] = useState(true);
		if (!open) {
			return (
				<div className="p-4">
					<Button variant="outline" size="sm" onClick={() => setOpen(true)}>
						Show banner again
					</Button>
				</div>
			);
		}
		return (
			<Banner.Root {...args}>
				<MegaphoneIcon />
				<Banner.Title>
					Messaging is here — chat with clients directly.
				</Banner.Title>
				<Banner.Close onClick={() => setOpen(false)} />
			</Banner.Root>
		);
	},
};
