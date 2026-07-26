import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Field } from "@voila.dev/ui/field";
import { Textarea } from "@voila.dev/ui/textarea";

const meta = {
	title: "UI/Textarea",
	component: Textarea,
	tags: ["autodocs"],
	args: {
		placeholder: "Describe the project for the freelancer...",
	},
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
	args: {
		defaultValue:
			"Complete redesign of the marketing site for the spring launch. Join the kickoff call one hour early for scope and handoff review.",
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
			"Complete redesign of the marketing site for the spring launch.",
			"Join the kickoff call one hour early for scope and handoff review.",
			"Stay through the retro and compile the delivery report.",
			"Coordinate with the client lead on any scope-change assessment.",
			"Update the design system library and flag missing tokens.",
			"Debrief the project manager on availability for next quarter.",
			"File the project report within 48 hours of the final milestone.",
			"Note any follow-up recommendations per deliverable.",
			"Confirm expense reimbursement details with the client admin.",
			"Leave escalation contact instructions with the account manager.",
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
			<Field.Root invalid>
				<Field.Label htmlFor="project-description">
					Project description
				</Field.Label>
				<Textarea
					id="project-description"
					aria-invalid
					defaultValue="Too short"
					placeholder="Describe the project for the freelancer..."
				/>
				<Field.Description>
					Freelancers see this before applying.
				</Field.Description>
				<Field.Error>
					The description must be at least 80 characters.
				</Field.Error>
			</Field.Root>
		</div>
	),
};
