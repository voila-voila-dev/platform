import { StepperDescription } from "#/stepper/components/stepper-description.tsx";
import { StepperIndicator } from "#/stepper/components/stepper-indicator.tsx";
import { StepperItem } from "#/stepper/components/stepper-item.tsx";
import { StepperRoot } from "#/stepper/components/stepper-root.tsx";
import { StepperSeparator } from "#/stepper/components/stepper-separator.tsx";
import { StepperTitle } from "#/stepper/components/stepper-title.tsx";

export type { StepperStepState } from "#/stepper/context/stepper-item-context.ts";

/**
 * The Stepper parts as one namespace.
 */
export const Stepper = {
	Root: StepperRoot,
	Description: StepperDescription,
	Indicator: StepperIndicator,
	Item: StepperItem,
	Separator: StepperSeparator,
	Title: StepperTitle,
};
