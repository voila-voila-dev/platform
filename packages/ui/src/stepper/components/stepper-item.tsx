import * as React from "react";

import { cn } from "#/lib/utils.ts";
import { useStepperContext } from "#/stepper/context/stepper-context.ts";
import {
	StepperItemContext,
	type StepperStepState,
} from "#/stepper/context/stepper-item-context.ts";

interface Props extends React.ComponentProps<"li"> {
	step: number;
}

/**
 * One step: its indicator, title and description, plus the state the
 * separator after it reads.
 */
export function StepperItem({ className, step, ...props }: Props) {
	const { value, orientation } = useStepperContext("Stepper.Item");
	const state: StepperStepState =
		step < value ? "completed" : step === value ? "active" : "inactive";
	const contextValue = React.useMemo(() => ({ step, state }), [step, state]);
	return (
		<StepperItemContext.Provider value={contextValue}>
			<li
				data-slot="stepper-item"
				data-state={state}
				data-orientation={orientation}
				aria-current={state === "active" ? "step" : undefined}
				className={cn(
					"group/stepper-item flex items-center gap-2 data-[orientation=vertical]:relative data-[orientation=vertical]:items-start data-[orientation=vertical]:pb-6 data-[orientation=vertical]:last:pb-0 data-[orientation=horizontal]:[&:not(:last-child)]:flex-1",
					className,
				)}
				{...props}
			/>
		</StepperItemContext.Provider>
	);
}
