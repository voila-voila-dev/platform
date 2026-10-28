import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Input } from "@voila.dev/ui/input";
import { Label } from "@voila.dev/ui/label";

const meta = {
	title: "UI/Label",
	component: Label,
	tags: ["autodocs"],
	args: {
		children: "Email address",
	},
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
	render: () => (
		<div className="grid w-72 gap-2">
			<Label htmlFor="workspace-email">Workspace email</Label>
			<Input
				id="workspace-email"
				type="email"
				placeholder="contact@example.com"
			/>
		</div>
	),
};

export const WithIconAndRequired: Story = {
	render: () => (
		<div className="grid w-72 gap-2">
			<Label htmlFor="client-email">
				<EnvelopeSimpleIcon />
				Client email
				<span aria-hidden="true" className="text-destructive">
					*
				</span>
			</Label>
			<Input
				id="client-email"
				type="email"
				required
				placeholder="contact@example.com"
			/>
		</div>
	),
};

export const DisabledPeer: Story = {
	render: () => (
		<div className="grid w-72 gap-6">
			<div className="grid gap-2">
				<Input
					id="disabled-peer-email"
					className="peer order-2"
					type="email"
					placeholder="contact@example.com"
					disabled
				/>
				<Label htmlFor="disabled-peer-email" className="order-1">
					Peer-disabled input
				</Label>
			</div>
			<div className="group grid gap-2" data-disabled="true">
				<Label htmlFor="disabled-group-email">Group-disabled field</Label>
				<Input
					id="disabled-group-email"
					type="email"
					placeholder="contact@example.com"
					disabled
				/>
			</div>
		</div>
	),
};
