import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	Stepper,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTitle,
} from "@voila.dev/ui/components/stepper";
import { useState } from "react";

const meta = {
	title: "UI/Stepper",
	component: Stepper,
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
} satisfies Meta<typeof Stepper>;

export default meta;

type Story = StoryObj<typeof meta>;

const onboardingSteps = [
	{ step: 1, title: "Profile", description: "Your details" },
	{ step: 2, title: "Availability", description: "Your time slots" },
	{ step: 3, title: "Review", description: "Account verification" },
];

export const Default: Story = {
	render: (args) => (
		<Stepper {...args} className="max-w-xl">
			{onboardingSteps.map(({ step, title }) => (
				<StepperItem key={step} step={step}>
					<StepperIndicator />
					<StepperTitle>{title}</StepperTitle>
					{step < onboardingSteps.length ? <StepperSeparator /> : null}
				</StepperItem>
			))}
		</Stepper>
	),
};

export const AllCompleted: Story = {
	args: { value: 4 },
	render: (args) => (
		<Stepper {...args} className="max-w-xl">
			{onboardingSteps.map(({ step, title }) => (
				<StepperItem key={step} step={step}>
					<StepperIndicator />
					<StepperTitle>{title}</StepperTitle>
					{step < onboardingSteps.length ? <StepperSeparator /> : null}
				</StepperItem>
			))}
		</Stepper>
	),
};

export const IndicatorsOnly: Story = {
	render: (args) => (
		<Stepper {...args} className="max-w-xs">
			{onboardingSteps.map(({ step }) => (
				<StepperItem key={step} step={step}>
					<StepperIndicator />
					{step < onboardingSteps.length ? <StepperSeparator /> : null}
				</StepperItem>
			))}
		</Stepper>
	),
};

export const Vertical: Story = {
	args: { orientation: "vertical" },
	render: (args) => (
		<Stepper {...args} className="max-w-xs">
			{onboardingSteps.map(({ step, title, description }) => (
				<StepperItem key={step} step={step}>
					<StepperIndicator />
					<div className="flex flex-col gap-0.5">
						<StepperTitle>{title}</StepperTitle>
						<StepperDescription>{description}</StepperDescription>
					</div>
					{step < onboardingSteps.length ? <StepperSeparator /> : null}
				</StepperItem>
			))}
		</Stepper>
	),
};

export const Interactive: Story = {
	render: function InteractiveStory() {
		const [value, setValue] = useState(1);
		return (
			<div className="flex max-w-xl flex-col gap-6">
				<Stepper value={value}>
					{onboardingSteps.map(({ step, title }) => (
						<StepperItem key={step} step={step}>
							<StepperIndicator />
							<StepperTitle>{title}</StepperTitle>
							{step < onboardingSteps.length ? <StepperSeparator /> : null}
						</StepperItem>
					))}
				</Stepper>
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
