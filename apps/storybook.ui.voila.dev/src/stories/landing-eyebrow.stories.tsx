import { BuildingsIcon, StethoscopeIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Eyebrow, toneOptions } from "@voila.dev/ui-landing/components/eyebrow";

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
			<Eyebrow.Label>Ce en quoi nous croyons</Eyebrow.Label>
		</Eyebrow.Root>
	),
} satisfies Meta<typeof Eyebrow.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPulseDot: Story = {
	render: () => (
		<Eyebrow.Root tone="provider">
			<Eyebrow.Dot pulse />
			<Eyebrow.Label>Nouvelle plateforme</Eyebrow.Label>
		</Eyebrow.Root>
	),
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			<Eyebrow.Root tone="organization">
				<Eyebrow.Icon>
					<BuildingsIcon />
				</Eyebrow.Icon>
				<Eyebrow.Label>Pour les clubs de sport</Eyebrow.Label>
			</Eyebrow.Root>
			<Eyebrow.Root tone="provider">
				<Eyebrow.Icon>
					<StethoscopeIcon />
				</Eyebrow.Icon>
				<Eyebrow.Label>Pour les professionnels</Eyebrow.Label>
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
