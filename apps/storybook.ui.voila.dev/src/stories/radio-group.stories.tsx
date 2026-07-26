import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Label } from "@voila.dev/ui/label";
import { RadioGroup } from "@voila.dev/ui/radio-group";
import { useState } from "react";

const meta = {
	title: "UI/RadioGroup",
	component: RadioGroup.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<RadioGroup.Root defaultValue="designer" className="w-64">
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="designer" id="profession-designer" />
				<Label htmlFor="profession-designer">Designer</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="developer" id="profession-developer" />
				<Label htmlFor="profession-developer">Developer</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="copywriter" id="profession-copywriter" />
				<Label htmlFor="profession-copywriter">Copywriter</Label>
			</div>
		</RadioGroup.Root>
	),
};

export const Horizontal: Story = {
	render: () => (
		<RadioGroup.Root defaultValue="day" orientation="horizontal">
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="day" id="shift-day" />
				<Label htmlFor="shift-day">Day</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="evening" id="shift-evening" />
				<Label htmlFor="shift-evening">Evening</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="night" id="shift-night" />
				<Label htmlFor="shift-night">Night</Label>
			</div>
		</RadioGroup.Root>
	),
};

// Whole group disabled - items dim via `data-disabled:` and selection is blocked.
export const Disabled: Story = {
	render: () => (
		<RadioGroup.Root defaultValue="single" disabled className="w-64">
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="single" id="recurrence-single" />
				<Label htmlFor="recurrence-single">Single project</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="weekly" id="recurrence-weekly" />
				<Label htmlFor="recurrence-weekly">Weekly recurring</Label>
			</div>
		</RadioGroup.Root>
	),
};

// A single option disabled while the rest of the group stays interactive.
export const ItemDisabled: Story = {
	render: () => (
		<RadioGroup.Root defaultValue="standard" className="w-64">
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="standard" id="plan-standard" />
				<Label htmlFor="plan-standard">Standard</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="express" id="plan-express" />
				<Label htmlFor="plan-express">Express</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="premium" id="plan-premium" disabled />
				<Label htmlFor="plan-premium">Premium (sold out)</Label>
			</div>
		</RadioGroup.Root>
	),
};

// `aria-invalid` on the items paints the destructive ring (no default selection
// so every item shows the error state).
export const Invalid: Story = {
	render: () => (
		<RadioGroup.Root className="w-64">
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="yes" id="consent-yes" aria-invalid />
				<Label htmlFor="consent-yes">Yes</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroup.Item value="no" id="consent-no" aria-invalid />
				<Label htmlFor="consent-no">No</Label>
			</div>
		</RadioGroup.Root>
	),
};

// Bordered "choice card" variant for plan/role pickers - children are
// free-form, the checked card gets a primary border plus a corner icon.
export const ChoiceCards: Story = {
	render: () => (
		<RadioGroup.Root defaultValue="client" className="w-80">
			<RadioGroup.Card value="client">
				<span className="font-medium">Client</span>
				<span className="text-muted-foreground">
					Post projects and find vetted independent freelancers.
				</span>
			</RadioGroup.Card>
			<RadioGroup.Card value="freelancer">
				<span className="font-medium">Freelancer</span>
				<span className="text-muted-foreground">
					Apply to projects from clients that match your skills.
				</span>
			</RadioGroup.Card>
		</RadioGroup.Root>
	),
};

// Cards in a grid: pass grid classes via className on the group. The sold-out
// plan is disabled; `showIndicator={false}` suits cards whose content already
// marks selection.
export const ChoiceCardsGrid: Story = {
	render: () => (
		<RadioGroup.Root
			defaultValue="standard"
			className="grid w-160 max-w-full grid-cols-3"
		>
			<RadioGroup.Card value="standard">
				<span className="font-medium">Standard</span>
				<span className="text-muted-foreground">$29 / project</span>
			</RadioGroup.Card>
			<RadioGroup.Card value="express">
				<span className="font-medium">Express</span>
				<span className="text-muted-foreground">$49 / project</span>
			</RadioGroup.Card>
			<RadioGroup.Card value="premium" disabled>
				<span className="font-medium">Premium</span>
				<span className="text-muted-foreground">Coming soon</span>
			</RadioGroup.Card>
		</RadioGroup.Root>
	),
};

export const Controlled: Story = {
	render: () => {
		const [value, setValue] = useState("developer");
		return (
			<div className="flex flex-col gap-3">
				<RadioGroup.Root
					value={value}
					onValueChange={(next) => setValue(next as string)}
					className="w-64"
				>
					<div className="flex items-center gap-2">
						<RadioGroup.Item value="designer" id="ctrl-designer" />
						<Label htmlFor="ctrl-designer">Designer</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroup.Item value="developer" id="ctrl-developer" />
						<Label htmlFor="ctrl-developer">Developer</Label>
					</div>
				</RadioGroup.Root>
				<p className="text-muted-foreground text-sm">Selected: {value}</p>
			</div>
		);
	},
};
