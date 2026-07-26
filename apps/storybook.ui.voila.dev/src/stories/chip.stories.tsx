import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Chip } from "@voila.dev/ui/chip";
import { useState } from "react";

const meta = {
	title: "UI/Chip",
	component: Chip.Root,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"secondary",
				"brand",
				"highlight",
				"destructive",
				"outline",
			],
		},
		size: {
			control: "select",
			options: ["default", "sm"],
		},
	},
	args: {
		variant: "secondary",
		size: "default",
	},
} satisfies Meta<typeof Chip.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Chip.Root {...args}>
			Product design
			<Chip.Remove aria-label="Remove Product design" />
		</Chip.Root>
	),
};

export const Static: Story = {
	render: (args) => <Chip.Root {...args}>Product design</Chip.Root>,
};

export const Colors: Story = {
	render: () => (
		<div className="flex max-w-md flex-wrap gap-2">
			<Chip.Root color="blue">
				Branding
				<Chip.Remove aria-label="Remove Branding" />
			</Chip.Root>
			<Chip.Root color="green">
				Research
				<Chip.Remove aria-label="Remove Research" />
			</Chip.Root>
			<Chip.Root color="amber">
				Prototyping
				<Chip.Remove aria-label="Remove Prototyping" />
			</Chip.Root>
			<Chip.Root color="violet">
				Analytics
				<Chip.Remove aria-label="Remove Analytics" />
			</Chip.Root>
		</div>
	),
};

export const Outline: Story = {
	args: { variant: "outline" },
	render: (args) => (
		<Chip.Root {...args}>
			Web design
			<Chip.Remove aria-label="Remove Web design" />
		</Chip.Root>
	),
};

export const Small: Story = {
	args: { size: "sm" },
	render: (args) => (
		<Chip.Root {...args}>
			SEO
			<Chip.Remove aria-label="Remove SEO" />
		</Chip.Root>
	),
};

export const SkillsCatalog: Story = {
	render: function SkillsCatalogStory() {
		const [skills, setSkills] = useState([
			"Product design",
			"Prototyping",
			"User research",
			"Design systems",
		]);
		return (
			<div className="flex max-w-md flex-wrap gap-2">
				{skills.map((skill) => (
					<Chip.Root key={skill}>
						{skill}
						<Chip.Remove
							aria-label={`Remove ${skill}`}
							onClick={() =>
								setSkills((current) =>
									current.filter((other) => other !== skill),
								)
							}
						/>
					</Chip.Root>
				))}
				{skills.length === 0 ? (
					<span className="text-sm text-muted-foreground">
						No skills selected.
					</span>
				) : null}
			</div>
		);
	},
};
