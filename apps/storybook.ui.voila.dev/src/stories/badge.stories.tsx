import { CheckCircleIcon, ClockIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Badge,
	badgeColors,
	badgeVariantOptions,
} from "@voila.dev/ui/components/badge";

const meta = {
	title: "UI/Badge",
	component: Badge,
	tags: ["autodocs"],
	args: {
		children: "Badge",
	},
	argTypes: {
		variant: {
			control: "select",
			options: badgeVariantOptions,
		},
		color: {
			control: "select",
			options: badgeColors,
		},
		size: {
			control: "select",
			options: ["sm", "default"],
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Badge variant="default">Open</Badge>
			<Badge variant="secondary">Draft</Badge>
			<Badge variant="provider">Provider</Badge>
			<Badge variant="organization">Club</Badge>
			<Badge variant="destructive">Cancelled</Badge>
			<Badge variant="outline">Pending</Badge>
			<Badge variant="ghost">Archived</Badge>
			<Badge variant="link">View mission</Badge>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Badge size="sm">Small</Badge>
			<Badge size="default">Default</Badge>
			<Badge size="sm" variant="outline">
				<CheckCircleIcon data-icon="inline-start" />
				Small with icon
			</Badge>
		</div>
	),
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Badge>
				<CheckCircleIcon data-icon="inline-start" />
				Confirmed
			</Badge>
			<Badge variant="outline">
				Pending
				<ClockIcon data-icon="inline-end" />
			</Badge>
		</div>
	),
};

export const AsLink: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Badge render={<a href="#missions">Open missions</a>} />
			<Badge variant="ghost" render={<a href="#archive">Archived</a>} />
			<Badge variant="link" render={<a href="#mission">View mission</a>} />
		</div>
	),
};

export const VariantWithColor: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Badge variant="default" color="blue">
				Color wins over variant
			</Badge>
			<Badge variant="destructive" color="emerald">
				Emerald over destructive
			</Badge>
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className="flex max-w-md flex-wrap items-center gap-2">
			{badgeColors.map((color) => (
				<Badge key={color} color={color}>
					{color}
				</Badge>
			))}
		</div>
	),
};
