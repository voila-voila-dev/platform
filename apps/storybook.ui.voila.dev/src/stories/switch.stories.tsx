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
			<Switch id="mission-notifications" defaultChecked />
			<Label htmlFor="mission-notifications">
				Notify me about new missions
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
			<Label htmlFor="terms">Accept the staffing agreement</Label>
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
				<Label htmlFor="availability">Available for missions</Label>
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
				<FieldLabel htmlFor="match-alerts">Match-day alerts</FieldLabel>
				<FieldDescription>
					Get notified when a club nearby posts a last-minute mission.
				</FieldDescription>
			</FieldContent>
			<Switch id="match-alerts" defaultChecked />
		</Field>
	),
};
