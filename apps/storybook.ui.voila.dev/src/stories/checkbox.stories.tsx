import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@voila.dev/ui/components/checkbox";
import { Label } from "@voila.dev/ui/components/label";
import { useState } from "react";

const meta = {
	title: "UI/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="flex items-start gap-3">
			<Checkbox id="project-terms" />
			<div className="grid gap-1 text-sm">
				<Label htmlFor="project-terms">Accept project terms</Label>
				<p className="text-muted-foreground">
					You confirm your availability for the full duration of the project.
				</p>
			</div>
		</div>
	),
};

export const Checked: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Checkbox id="project-notifications" defaultChecked />
			<Label htmlFor="project-notifications">
				Notify me about new projects matching my skills
			</Label>
		</div>
	),
};

const IndeterminateExample = () => {
	const [selected, setSelected] = useState<ReadonlyArray<string>>(["design"]);
	const skills: ReadonlyArray<{ id: string; label: string }> = [
		{ id: "design", label: "Design" },
		{ id: "development", label: "Development" },
	];
	const allSelected = selected.length === skills.length;
	const someSelected = selected.length > 0 && !allSelected;
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<Checkbox
					id="all-skills"
					checked={allSelected}
					indeterminate={someSelected}
					onCheckedChange={(checked) =>
						setSelected(checked ? skills.map((skill) => skill.id) : [])
					}
				/>
				<Label htmlFor="all-skills">All skills</Label>
			</div>
			{skills.map((skill) => (
				<div className="ml-6 flex items-center gap-3" key={skill.id}>
					<Checkbox
						id={skill.id}
						checked={selected.includes(skill.id)}
						onCheckedChange={(checked) =>
							setSelected((current) =>
								checked
									? [...current, skill.id]
									: current.filter((id) => id !== skill.id),
							)
						}
					/>
					<Label htmlFor={skill.id}>{skill.label}</Label>
				</div>
			))}
		</div>
	);
};

export const Indeterminate: Story = {
	render: () => <IndeterminateExample />,
};

export const Invalid: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<Checkbox aria-invalid id="invalid-unchecked" />
				<Label htmlFor="invalid-unchecked">Invalid unchecked</Label>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox aria-invalid defaultChecked id="invalid-checked" />
				<Label htmlFor="invalid-checked">Invalid checked</Label>
			</div>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<Checkbox defaultChecked id="size-default" />
				<Label htmlFor="size-default">Default</Label>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox defaultChecked id="size-sm" size="sm" />
				<Label htmlFor="size-sm">Small</Label>
			</div>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<Checkbox id="disabled-unchecked" disabled />
				<Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox id="disabled-checked" disabled defaultChecked />
				<Label htmlFor="disabled-checked">Disabled checked</Label>
			</div>
		</div>
	),
};
