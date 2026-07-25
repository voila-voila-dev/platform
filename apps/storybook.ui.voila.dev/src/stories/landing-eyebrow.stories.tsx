import { BuildingsIcon, PenNibIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Eyebrow, toneOptions } from "@voila.dev/ui/landing/eyebrow";

const meta = {
	title: "Landing/Eyebrow",
	component: Eyebrow.Root,
	tags: ["autodocs"],
	argTypes: {
		tone: {
			control: "select",
			options: toneOptions,
		},
	},
	args: {
		tone: "primary",
	},
	render: (args) => (
		<Eyebrow.Root {...args}>
			<Eyebrow.Label>What we believe in</Eyebrow.Label>
		</Eyebrow.Root>
	),
} satisfies Meta<typeof Eyebrow.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPulseDot: Story = {
	render: () => (
		<Eyebrow.Root tone="brand">
			<Eyebrow.Dot pulse />
			<Eyebrow.Label>New platform</Eyebrow.Label>
		</Eyebrow.Root>
	),
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Eyebrow.Root tone="highlight">
				<Eyebrow.Icon>
					<BuildingsIcon />
				</Eyebrow.Icon>
				<Eyebrow.Label>For client teams</Eyebrow.Label>
			</Eyebrow.Root>
			<Eyebrow.Root tone="brand">
				<Eyebrow.Icon>
					<PenNibIcon />
				</Eyebrow.Icon>
				<Eyebrow.Label>For freelancers</Eyebrow.Label>
			</Eyebrow.Root>
		</div>
	),
};

export const Tones: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{toneOptions.map((tone) => (
				<Eyebrow.Root key={tone} tone={tone}>
					<Eyebrow.Dot />
					<Eyebrow.Label>{tone}</Eyebrow.Label>
				</Eyebrow.Root>
			))}
		</div>
	),
};
