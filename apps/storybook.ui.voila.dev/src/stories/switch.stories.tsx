import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
} from "@voila.dev/ui/components/field";
import { Label } from "@voila.dev/ui/components/label";
import { Switch } from "@voila.dev/ui/components/switch";
import { useState } from "react";

const meta = {
	title: "UI/Switch",
	component: Switch,
	tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Switch id="project-notifications" defaultChecked />
			<Label htmlFor="project-notifications">
				Notify me about new projects
			</Label>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Switch size="sm" defaultChecked />
			<Switch size="default" defaultChecked />
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Switch disabled />
			<Switch disabled defaultChecked />
		</div>
	),
};

export const Invalid: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Switch id="terms" aria-invalid />
			<Label htmlFor="terms">Accept the service agreement</Label>
		</div>
	),
};

function ControlledSwitch() {
	const [checked, setChecked] = useState(false);
	return (
		<div className="flex flex-col items-start gap-3">
			<div className="flex items-center gap-2">
				<Switch
					id="availability"
					checked={checked}
					onCheckedChange={setChecked}
				/>
				<Label htmlFor="availability">Available for projects</Label>
			</div>
			<span className="text-sm text-muted-foreground">
				State: {checked ? "available" : "unavailable"}
			</span>
		</div>
	);
}

export const Controlled: Story = {
	render: () => <ControlledSwitch />,
};

export const WithField: Story = {
	render: () => (
		<Field orientation="horizontal" className="max-w-sm">
			<FieldContent>
				<FieldLabel htmlFor="launch-alerts">Launch-day alerts</FieldLabel>
				<FieldDescription>
					Get notified when a client posts a last-minute project.
				</FieldDescription>
			</FieldContent>
			<Switch id="launch-alerts" defaultChecked />
		</Field>
	),
};
