import * as React from "react";

export type StepperStepState = "completed" | "active" | "inactive";

export const StepperItemContext = React.createContext<{
	step: number;
	state: StepperStepState;
} | null>(null);

export function useStepperItemContext(componentName: string) {
	const context = React.useContext(StepperItemContext);
	if (!context) {
		throw new Error(`<${componentName}> must be used within <Stepper.Item>`);
	}
	return context;
}
