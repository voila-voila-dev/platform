import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@voila.dev/ui/checkbox";
import { CheckboxGroup } from "@voila.dev/ui/checkbox-group";
import { Label } from "@voila.dev/ui/label";
import { useState } from "react";

const meta = {
	title: "UI/CheckboxGroup",
	component: CheckboxGroup,
	tags: ["autodocs"],
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const SKILLS = [
	{ name: "design", label: "Design" },
	{ name: "development", label: "Development" },
	{ name: "copywriting", label: "Copywriting" },
] as const;

export const Default: Story = {
	render: () => (
		<CheckboxGroup defaultValue={["design"]} className="w-64">
			{SKILLS.map((skill) => (
				<div key={skill.name} className="flex items-center gap-2">
					<Checkbox name={skill.name} id={`skills-${skill.name}`} />
					<Label htmlFor={`skills-${skill.name}`}>{skill.label}</Label>
				</div>
			))}
		</CheckboxGroup>
	),
};

// The wrapping-row layout filter bars need.
export const Horizontal: Story = {
	render: () => (
		<CheckboxGroup orientation="horizontal" defaultValue={["development"]}>
			{SKILLS.map((skill) => (
				<div key={skill.name} className="flex items-center gap-2">
					<Checkbox name={skill.name} id={`filter-${skill.name}`} />
					<Label htmlFor={`filter-${skill.name}`}>{skill.label}</Label>
				</div>
			))}
		</CheckboxGroup>
	),
};

// A parent checkbox (`parent` + `allValues`) ticks the whole set and shows the
// indeterminate dash while only some children are ticked. Labels must WRAP the
// checkboxes here (implicit association): in parent mode Base UI overrides the
// boxes' `id`s for its `aria-controls` wiring, so `htmlFor`/`id` pairs break.
export const WithParentCheckbox: Story = {
	render: () => (
		<CheckboxGroup
			defaultValue={["design"]}
			allValues={SKILLS.map((skill) => skill.name)}
			className="w-64"
		>
			<Label className="font-medium">
				<Checkbox parent />
				All skills
			</Label>
			{SKILLS.map((skill) => (
				<Label key={skill.name} className="ml-6">
					<Checkbox name={skill.name} />
					{skill.label}
				</Label>
			))}
		</CheckboxGroup>
	),
};

// Whole group disabled - boxes dim via `data-disabled:` and ticking is blocked.
export const Disabled: Story = {
	render: () => (
		<CheckboxGroup defaultValue={["copywriting"]} disabled className="w-64">
			{SKILLS.map((skill) => (
				<div key={skill.name} className="flex items-center gap-2">
					<Checkbox name={skill.name} id={`disabled-${skill.name}`} />
					<Label htmlFor={`disabled-${skill.name}`}>{skill.label}</Label>
				</div>
			))}
		</CheckboxGroup>
	),
};

export const Controlled: Story = {
	render: () => {
		const [value, setValue] = useState<string[]>(["design"]);
		return (
			<div className="flex flex-col gap-3">
				<CheckboxGroup value={value} onValueChange={setValue} className="w-64">
					{SKILLS.map((skill) => (
						<div key={skill.name} className="flex items-center gap-2">
							<Checkbox name={skill.name} id={`ctrl-${skill.name}`} />
							<Label htmlFor={`ctrl-${skill.name}`}>{skill.label}</Label>
						</div>
					))}
				</CheckboxGroup>
				<p className="text-muted-foreground text-sm">
					Selected: {value.length > 0 ? value.join(", ") : "none"}
				</p>
			</div>
		);
	},
};
