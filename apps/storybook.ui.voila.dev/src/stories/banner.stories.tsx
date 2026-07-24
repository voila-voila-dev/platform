import { MegaphoneIcon, WarningIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Banner,
	BannerAction,
	BannerClose,
	BannerTitle,
} from "@voila.dev/ui/components/banner";
import { Button } from "@voila.dev/ui/components/button";
import { useState } from "react";

const meta = {
	title: "UI/Banner",
	component: Banner,
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
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Banner {...args}>
			<MegaphoneIcon />
			<BannerTitle>
				Messaging is here — chat with clients directly from a project page.
			</BannerTitle>
			<BannerClose />
		</Banner>
	),
};

export const Muted: Story = {
	args: { variant: "muted" },
	render: (args) => (
		<Banner {...args}>
			<BannerTitle>
				Scheduled maintenance Sunday from 2 AM to 4 AM — the platform will be
				unavailable.
			</BannerTitle>
			<BannerClose />
		</Banner>
	),
};

export const Success: Story = {
	args: { variant: "success" },
	render: (args) => (
		<Banner {...args}>
			<BannerTitle>
				Your profile is complete — you can now apply to projects.
			</BannerTitle>
			<BannerClose />
		</Banner>
	),
};

export const Warning: Story = {
	args: { variant: "warning" },
	render: (args) => (
		<Banner {...args}>
			<WarningIcon />
			<BannerTitle>
				Your Stripe account is incomplete — finish the setup to receive your
				payouts.
			</BannerTitle>
		</Banner>
	),
};

export const Destructive: Story = {
	args: { variant: "destructive" },
	render: (args) => (
		<Banner {...args}>
			<WarningIcon />
			<BannerTitle>
				Your subscription payment failed — update your payment method.
			</BannerTitle>
		</Banner>
	),
};

export const WithAction: Story = {
	render: (args) => (
		<Banner {...args}>
			<MegaphoneIcon />
			<BannerTitle>Messaging is here — chat with clients directly.</BannerTitle>
			<BannerAction>
				<Button
					variant="outline"
					size="xs"
					className="border-current/30 bg-transparent text-current hover:bg-current/10 hover:text-current"
				>
					Learn more
				</Button>
			</BannerAction>
			<BannerClose />
		</Banner>
	),
};

export const WithLink: Story = {
	args: { variant: "warning" },
	render: (args) => (
		<Banner {...args}>
			<WarningIcon />
			<BannerTitle>
				Submit the <a href="#report">project report</a> within 48 hours to
				release the payment.
			</BannerTitle>
		</Banner>
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
			<Banner {...args}>
				<MegaphoneIcon />
				<BannerTitle>
					Messaging is here — chat with clients directly.
				</BannerTitle>
				<BannerClose onClick={() => setOpen(false)} />
			</Banner>
		);
	},
};
