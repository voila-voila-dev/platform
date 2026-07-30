import { Stepper } from "@voila.dev/ui/stepper";

const onboardingSteps = [
	{ step: 1, title: "Profile" },
	{ step: 2, title: "Availability" },
	{ step: 3, title: "Review" },
];

export function StepperExample() {
	return (
		<Stepper.Root value={2} className="w-full max-w-xl">
			{onboardingSteps.map(({ step, title }) => (
				<Stepper.Item key={step} step={step}>
					<Stepper.Indicator />
					<Stepper.Title>{title}</Stepper.Title>
					{step < onboardingSteps.length ? <Stepper.Separator /> : null}
				</Stepper.Item>
			))}
		</Stepper.Root>
	);
}
