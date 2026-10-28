import { CheckIcon } from "@phosphor-icons/react";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";
import { useStepperItemContext } from "#/stepper/context/stepper-item-context.ts";

interface Props extends React.ComponentProps<"span"> {}

/**
 * Step circle: renders the step number (or custom children) and swaps to a
 * check mark once the step is completed.
 */
export function StepperIndicator({ className, children, ...props }: Props) {
	const { step, state } = useStepperItemContext("Stepper.Indicator");
	return (
		<span
			data-slot="stepper-indicator"
			className={cn(
				"flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground tabular-nums transition-colors group-data-[state=active]/stepper-item:bg-primary group-data-[state=completed]/stepper-item:bg-primary group-data-[state=active]/stepper-item:text-primary-foreground group-data-[state=completed]/stepper-item:text-primary-foreground [&>svg]:size-3.5",
				className,
			)}
			{...props}
		>
			{state === "completed" ? <CheckIcon aria-hidden /> : (children ?? step)}
		</span>
	);
}
