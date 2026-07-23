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
				"provider",
				"organization",
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
			Kinésithérapie du sport
			<ChipRemove aria-label="Retirer Kinésithérapie du sport" />
		</Chip>
	),
};

export const Static: Story = {
	render: (args) => <Chip {...args}>Kinésithérapie du sport</Chip>,
};

export const Colors: Story = {
	render: () => (
		<div className="flex max-w-md flex-wrap gap-2">
			<Chip color="blue">
				Rugby
				<ChipRemove aria-label="Retirer Rugby" />
			</Chip>
			<Chip color="green">
				Récupération
				<ChipRemove aria-label="Retirer Récupération" />
			</Chip>
			<Chip color="amber">
				Strapping
				<ChipRemove aria-label="Retirer Strapping" />
			</Chip>
			<Chip color="violet">
				Ostéopathie
				<ChipRemove aria-label="Retirer Ostéopathie" />
			</Chip>
		</div>
	),
};

export const Outline: Story = {
	args: { variant: "outline" },
	render: (args) => (
		<Chip {...args}>
			Football
			<ChipRemove aria-label="Retirer Football" />
		</Chip>
	),
};

export const Small: Story = {
	args: { size: "sm" },
	render: (args) => (
		<Chip {...args}>
			Handball
			<ChipRemove aria-label="Retirer Handball" />
		</Chip>
	),
};

export const SkillsCatalog: Story = {
	render: function SkillsCatalogStory() {
		const [skills, setSkills] = useState([
			"Kinésithérapie du sport",
			"Strapping",
			"Récupération",
			"Urgences terrain",
		]);
		return (
			<div className="flex max-w-md flex-wrap gap-2">
				{skills.map((skill) => (
					<Chip key={skill}>
						{skill}
						<ChipRemove
							aria-label={`Retirer ${skill}`}
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
						Aucune compétence sélectionnée.
					</span>
				) : null}
			</div>
		);
	},
};
