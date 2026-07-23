import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@voila.dev/ui/components/field";
import { Textarea } from "@voila.dev/ui/components/textarea";

const meta = {
	title: "UI/Textarea",
	component: Textarea,
	tags: ["autodocs"],
	args: {
		placeholder: "Describe the mission for the provider...",
	},
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
	args: {
		defaultValue:
			"Pitch-side physiotherapy cover for the Saturday home match. Arrive one hour before kick-off for taping and warm-up support.",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

/** Past `max-h-64` the auto-growth stops and the textarea scrolls. */
export const Overflowing: Story = {
	args: {
		defaultValue: [
			"Pitch-side physiotherapy cover for the Saturday home match.",
			"Arrive one hour before kick-off for taping and warm-up support.",
			"Stay through the cool-down and compile the injury report.",
			"Coordinate with the club doctor on any head-injury assessment.",
			"Restock the medical bag and flag missing supplies to the staff.",
			"Debrief the head coach on player availability for next week.",
			"File the fiche de suivi within 48 hours of the final whistle.",
			"Note any follow-up treatment recommendations per player.",
			"Confirm travel reimbursement details with the club secretary.",
			"Leave emergency contact instructions with the duty manager.",
		].join("\n\n"),
	},
};

/**
 * `field-sizing-content` makes the `rows` attribute inert - size the empty
 * field with `min-h-*` instead.
 */
export const TallerMinHeight: Story = {
	args: {
		className: "min-h-40",
	},
};

export const Invalid: Story = {
	args: {
		"aria-invalid": true,
		defaultValue: "Too short",
	},
};

export const InField: Story = {
	render: () => (
		<div className="w-96">
			<Field invalid>
				<FieldLabel htmlFor="mission-description">
					Mission description
				</FieldLabel>
				<Textarea
					id="mission-description"
					aria-invalid
					defaultValue="Too short"
					placeholder="Describe the mission for the provider..."
				/>
				<FieldDescription>Providers see this before applying.</FieldDescription>
				<FieldError>The description must be at least 80 characters.</FieldError>
			</Field>
		</div>
	),
};
