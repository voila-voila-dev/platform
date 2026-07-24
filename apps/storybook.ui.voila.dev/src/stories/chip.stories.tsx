import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Chip, ChipRemove } from "@voila.dev/ui/components/chip";
import { useState } from "react";

const meta = {
	title: "UI/Chip",
	component: Chip,
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
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Chip {...args}>
			Product design
			<ChipRemove aria-label="Remove Product design" />
		</Chip>
	),
};

export const Static: Story = {
	render: (args) => <Chip {...args}>Product design</Chip>,
};

export const Colors: Story = {
	render: () => (
		<div className="flex max-w-md flex-wrap gap-2">
			<Chip color="blue">
				Branding
				<ChipRemove aria-label="Remove Branding" />
			</Chip>
			<Chip color="green">
				Research
				<ChipRemove aria-label="Remove Research" />
			</Chip>
			<Chip color="amber">
				Prototyping
				<ChipRemove aria-label="Remove Prototyping" />
			</Chip>
			<Chip color="violet">
				Analytics
				<ChipRemove aria-label="Remove Analytics" />
			</Chip>
		</div>
	),
};

export const Outline: Story = {
	args: { variant: "outline" },
	render: (args) => (
		<Chip {...args}>
			Web design
			<ChipRemove aria-label="Remove Web design" />
		</Chip>
	),
};

export const Small: Story = {
	args: { size: "sm" },
	render: (args) => (
		<Chip {...args}>
			SEO
			<ChipRemove aria-label="Remove SEO" />
		</Chip>
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
					<Chip key={skill}>
						{skill}
						<ChipRemove
							aria-label={`Remove ${skill}`}
							onClick={() =>
								setSkills((current) =>
									current.filter((other) => other !== skill),
								)
							}
						/>
					</Chip>
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
