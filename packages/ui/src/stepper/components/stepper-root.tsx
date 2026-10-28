import * as React from "react";

import { cn } from "#/lib/utils.ts";
import {
	StepperContext,
	type StepperOrientation,
} from "#/stepper/context/stepper-context.ts";

interface Props extends React.ComponentProps<"ol"> {
	value: number;
	orientation?: StepperOrientation;
}

/**
 * Presentational progress indicator for multi-step flows (onboarding,
 * booking). `value` is the 1-based active step: steps below it render as
 * completed, the step equal to it as active, the rest as inactive. Navigation
 * stays with the consumer - wire buttons or router links around it.
 */
export function StepperRoot({
	className,
	value,
	orientation = "horizontal",
	...props
}: Props) {
	const contextValue = React.useMemo(
		() => ({ value, orientation }),
		[value, orientation],
	);
	return (
		<StepperContext.Provider value={contextValue}>
			<ol
				data-slot="stepper"
				data-orientation={orientation}
				className={cn(
					"group/stepper flex w-full data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-6",
					className,
				)}
				{...props}
			/>
		</StepperContext.Provider>
	);
}
