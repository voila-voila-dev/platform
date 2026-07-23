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
				<h4 className="text-sm font-medium">Mission details</h4>
				<p className="text-sm text-muted-foreground">
					Saturday match cover at Stade Rochelais.
				</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center gap-4 text-sm">
				<span>Missions</span>
				<Separator orientation="vertical" />
				<span>Providers</span>
				<Separator orientation="vertical" />
				<span>Billing</span>
			</div>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className="flex h-8 items-center gap-4 text-sm">
			<span>Club</span>
			<Separator orientation="vertical" />
			<span>Provider</span>
		</div>
	),
};

/**
 * Pass children for the auth-screen "OU" divider. The lines flank the label,
 * so it works on any background - cards included.
 */
export const WithLabel: Story = {
	render: () => (
		<div className="flex w-72 flex-col gap-4">
			<Button>Se connecter par e-mail</Button>
			<Separator>OU</Separator>
			<Button variant="outline">Continuer avec Google</Button>
		</div>
	),
};

export const WithLabelVertical: Story = {
	render: () => (
		<div className="flex h-40 items-center gap-6 text-sm">
			<span>Connexion</span>
			<Separator orientation="vertical">OU</Separator>
			<span>Inscription</span>
		</div>
	),
};
