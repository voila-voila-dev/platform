import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Stepper } from "@voila.dev/ui/stepper";
import { useState } from "react";

const meta = {
	title: "UI/Stepper",
	component: Stepper.Root,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: { type: "number", min: 1, max: 3 },
		},
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
	},
	args: {
		value: 2,
		orientation: "horizontal",
	},
} satisfies Meta<typeof Stepper.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const onboardingSteps = [
	{ step: 1, title: "Profile", description: "Your details" },
	{ step: 2, title: "Availability", description: "Your time slots" },
	{ step: 3, title: "Review", description: "Account verification" },
];

export const Default: Story = {
	render: (args) => (
		<Stepper.Root {...args} className="max-w-xl">
			{onboardingSteps.map(({ step, title }) => (
				<Stepper.Item key={step} step={step}>
					<Stepper.Indicator />
					<Stepper.Title>{title}</Stepper.Title>
					{step < onboardingSteps.length ? <Stepper.Separator /> : null}
				</Stepper.Item>
			))}
		</Stepper.Root>
	),
};

export const AllCompleted: Story = {
	args: { value: 4 },
	render: (args) => (
		<Stepper.Root {...args} className="max-w-xl">
			{onboardingSteps.map(({ step, title }) => (
				<Stepper.Item key={step} step={step}>
					<Stepper.Indicator />
					<Stepper.Title>{title}</Stepper.Title>
					{step < onboardingSteps.length ? <Stepper.Separator /> : null}
				</Stepper.Item>
			))}
		</Stepper.Root>
	),
};

export const IndicatorsOnly: Story = {
	render: (args) => (
		<Stepper.Root {...args} className="max-w-xs">
			{onboardingSteps.map(({ step }) => (
				<Stepper.Item key={step} step={step}>
					<Stepper.Indicator />
					{step < onboardingSteps.length ? <Stepper.Separator /> : null}
				</Stepper.Item>
			))}
		</Stepper.Root>
	),
};

export const Vertical: Story = {
	args: { orientation: "vertical" },
	render: (args) => (
		<Stepper.Root {...args} className="max-w-xs">
			{onboardingSteps.map(({ step, title, description }) => (
				<Stepper.Item key={step} step={step}>
					<Stepper.Indicator />
					<div className="flex flex-col gap-0.5">
						<Stepper.Title>{title}</Stepper.Title>
						<Stepper.Description>{description}</Stepper.Description>
					</div>
					{step < onboardingSteps.length ? <Stepper.Separator /> : null}
				</Stepper.Item>
			))}
		</Stepper.Root>
	),
};

export const Interactive: Story = {
	render: function InteractiveStory() {
		const [value, setValue] = useState(1);
		return (
			<div className="flex max-w-xl flex-col gap-6">
				<Stepper.Root value={value}>
					{onboardingSteps.map(({ step, title }) => (
						<Stepper.Item key={step} step={step}>
							<Stepper.Indicator />
							<Stepper.Title>{title}</Stepper.Title>
							{step < onboardingSteps.length ? <Stepper.Separator /> : null}
						</Stepper.Item>
					))}
				</Stepper.Root>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={value <= 1}
						onClick={() => setValue((current) => current - 1)}
					>
						Previous
					</Button>
					<Button
						size="sm"
						disabled={value > onboardingSteps.length}
						onClick={() => setValue((current) => current + 1)}
					>
						{value >= onboardingSteps.length ? "Finish" : "Next"}
					</Button>
				</div>
			</div>
		);
	},
};
