import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { Separator } from "@voila.dev/ui/components/separator";

const meta = {
	title: "UI/Separator",
	component: Separator,
	tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-72">
			<div className="space-y-1">
				<h4 className="text-sm font-medium">Project details</h4>
				<p className="text-sm text-muted-foreground">
					Landing page redesign for Northwind Studio.
				</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center gap-4 text-sm">
				<span>Projects</span>
				<Separator orientation="vertical" />
				<span>Freelancers</span>
				<Separator orientation="vertical" />
				<span>Billing</span>
			</div>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className="flex h-8 items-center gap-4 text-sm">
			<span>Client</span>
			<Separator orientation="vertical" />
			<span>Freelancer</span>
		</div>
	),
};

/**
 * Pass children for the auth-screen "OR" divider. The lines flank the label,
 * so it works on any background - cards included.
 */
export const WithLabel: Story = {
	render: () => (
		<div className="flex w-72 flex-col gap-4">
			<Button>Sign in with email</Button>
			<Separator>OR</Separator>
			<Button variant="outline">Continue with Google</Button>
		</div>
	),
};

export const WithLabelVertical: Story = {
	render: () => (
		<div className="flex h-40 items-center gap-6 text-sm">
			<span>Sign in</span>
			<Separator orientation="vertical">OR</Separator>
			<span>Sign up</span>
		</div>
	),
};
