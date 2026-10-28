import * as React from "react";

import { cn } from "#/lib/utils.ts";
import { useStepperContext } from "#/stepper/context/stepper-context.ts";
import {
	StepperItemContext,
	type StepperStepState,
} from "#/stepper/context/stepper-item-context.ts";

interface Props extends React.ComponentProps<"li"> {
	step: number;
	/**
	 * Overrides the state derived from the root's `value` — for flows whose
	 * progression is not a simple index (a failed step, a skipped one).
	 */
	state?: StepperStepState;
}

/**
 * One step: its indicator, title and description, plus the state the
 * separator after it reads.
 */
export function StepperItem({
	className,
	step,
	state: stateOverride,
	...props
}: Props) {
	const { value, orientation } = useStepperContext("Stepper.Item");
	const state: StepperStepState =
		stateOverride ??
		(step < value ? "completed" : step === value ? "active" : "inactive");
	const contextValue = React.useMemo(() => ({ step, state }), [step, state]);
	return (
		<StepperItemContext.Provider value={contextValue}>
			<li
				data-slot="stepper-item"
				data-state={state}
				data-orientation={orientation}
				aria-current={state === "active" ? "step" : undefined}
				className={cn(
					"group/stepper-item flex items-center gap-2 data-[orientation=vertical]:relative data-[orientation=vertical]:items-start data-[orientation=horizontal]:[&:not(:last-child)]:flex-1",
					className,
				)}
				{...props}
			/>
		</StepperItemContext.Provider>
	);
}
