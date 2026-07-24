import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Label } from "@voila.dev/ui/components/label";
import {
	RadioGroup,
	RadioGroupCard,
	RadioGroupItem,
} from "@voila.dev/ui/components/radio-group";
import { useState } from "react";

const meta = {
	title: "UI/RadioGroup",
	component: RadioGroup,
	tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<RadioGroup defaultValue="designer" className="w-64">
			<div className="flex items-center gap-2">
				<RadioGroupItem value="designer" id="profession-designer" />
				<Label htmlFor="profession-designer">Designer</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="developer" id="profession-developer" />
				<Label htmlFor="profession-developer">Developer</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="copywriter" id="profession-copywriter" />
				<Label htmlFor="profession-copywriter">Copywriter</Label>
			</div>
		</RadioGroup>
	),
};

export const Horizontal: Story = {
	render: () => (
		<RadioGroup defaultValue="day" orientation="horizontal">
			<div className="flex items-center gap-2">
				<RadioGroupItem value="day" id="shift-day" />
				<Label htmlFor="shift-day">Day</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="evening" id="shift-evening" />
				<Label htmlFor="shift-evening">Evening</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="night" id="shift-night" />
				<Label htmlFor="shift-night">Night</Label>
			</div>
		</RadioGroup>
	),
};

// Whole group disabled - items dim via `data-disabled:` and selection is blocked.
export const Disabled: Story = {
	render: () => (
		<RadioGroup defaultValue="single" disabled className="w-64">
			<div className="flex items-center gap-2">
				<RadioGroupItem value="single" id="recurrence-single" />
				<Label htmlFor="recurrence-single">Single project</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="weekly" id="recurrence-weekly" />
				<Label htmlFor="recurrence-weekly">Weekly recurring</Label>
			</div>
		</RadioGroup>
	),
};

// A single option disabled while the rest of the group stays interactive.
export const ItemDisabled: Story = {
	render: () => (
		<RadioGroup defaultValue="standard" className="w-64">
			<div className="flex items-center gap-2">
				<RadioGroupItem value="standard" id="plan-standard" />
				<Label htmlFor="plan-standard">Standard</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="express" id="plan-express" />
				<Label htmlFor="plan-express">Express</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="premium" id="plan-premium" disabled />
				<Label htmlFor="plan-premium">Premium (sold out)</Label>
			</div>
		</RadioGroup>
	),
};

// `aria-invalid` on the items paints the destructive ring (no default selection
// so every item shows the error state).
export const Invalid: Story = {
	render: () => (
		<RadioGroup className="w-64">
			<div className="flex items-center gap-2">
				<RadioGroupItem value="yes" id="consent-yes" aria-invalid />
				<Label htmlFor="consent-yes">Yes</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="no" id="consent-no" aria-invalid />
				<Label htmlFor="consent-no">No</Label>
			</div>
		</RadioGroup>
	),
};

// Bordered "choice card" variant for plan/role pickers - children are
// free-form, the checked card gets a primary border plus a corner icon.
export const ChoiceCards: Story = {
	render: () => (
		<RadioGroup defaultValue="client" className="w-80">
			<RadioGroupCard value="client">
				<span className="font-medium">Client</span>
				<span className="text-muted-foreground">
					Post projects and find vetted independent freelancers.
				</span>
			</RadioGroupCard>
			<RadioGroupCard value="freelancer">
				<span className="font-medium">Freelancer</span>
				<span className="text-muted-foreground">
					Apply to projects from clients that match your skills.
				</span>
			</RadioGroupCard>
		</RadioGroup>
	),
};

// Cards in a grid: pass grid classes via className on the group. The sold-out
// plan is disabled; `showIndicator={false}` suits cards whose content already
// marks selection.
export const ChoiceCardsGrid: Story = {
	render: () => (
		<RadioGroup
			defaultValue="standard"
			className="grid w-160 max-w-full grid-cols-3"
		>
			<RadioGroupCard value="standard">
				<span className="font-medium">Standard</span>
				<span className="text-muted-foreground">$29 / project</span>
			</RadioGroupCard>
			<RadioGroupCard value="express">
				<span className="font-medium">Express</span>
				<span className="text-muted-foreground">$49 / project</span>
			</RadioGroupCard>
			<RadioGroupCard value="premium" disabled>
				<span className="font-medium">Premium</span>
				<span className="text-muted-foreground">Coming soon</span>
			</RadioGroupCard>
		</RadioGroup>
	),
};

export const Controlled: Story = {
	render: () => {
		const [value, setValue] = useState("developer");
		return (
			<div className="flex flex-col gap-3">
				<RadioGroup
					value={value}
					onValueChange={(next) => setValue(next as string)}
					className="w-64"
				>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="designer" id="ctrl-designer" />
						<Label htmlFor="ctrl-designer">Designer</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="developer" id="ctrl-developer" />
						<Label htmlFor="ctrl-developer">Developer</Label>
					</div>
				</RadioGroup>
				<p className="text-muted-foreground text-sm">Selected: {value}</p>
			</div>
		);
	},
};
