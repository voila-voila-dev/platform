import * as React from "react";

export type StepperOrientation = "horizontal" | "vertical";

export const StepperContext = React.createContext<{
	value: number;
	orientation: StepperOrientation;
} | null>(null);

export function useStepperContext(componentName: string) {
	const context = React.useContext(StepperContext);
	if (!context) {
		throw new Error(`<${componentName}> must be used within <Stepper.Root>`);
	}
	return context;
}
