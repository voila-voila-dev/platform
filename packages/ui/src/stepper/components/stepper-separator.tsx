import type * as React from "react";

import { cn } from "#/lib/utils.ts";
import { useStepperContext } from "#/stepper/context/stepper-context.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Connecting line to the next step. Horizontal: a flexible rule filling the
 * gap between items. Vertical: an absolute line dropping from the indicator,
 * sized by the item's bottom padding.
 */
export function StepperSeparator({ className, ...props }: Props) {
	const { orientation } = useStepperContext("Stepper.Separator");
	return (
		<div
			data-slot="stepper-separator"
			data-orientation={orientation}
			aria-hidden
			className={cn(
				"bg-border transition-colors group-data-[state=completed]/stepper-item:bg-primary",
				"data-[orientation=horizontal]:h-px data-[orientation=horizontal]:min-w-4 data-[orientation=horizontal]:flex-1",
				"data-[orientation=vertical]:absolute data-[orientation=vertical]:top-7 data-[orientation=vertical]:bottom-1 data-[orientation=vertical]:left-3 data-[orientation=vertical]:w-px data-[orientation=vertical]:-translate-x-1/2",
				className,
			)}
			{...props}
		/>
	);
}
