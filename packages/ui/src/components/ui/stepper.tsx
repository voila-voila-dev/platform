import { CheckIcon } from "@phosphor-icons/react";
import * as React from "react";

import { cn } from "#/lib/utils.ts";

type StepperOrientation = "horizontal" | "vertical";
type StepperStepState = "completed" | "active" | "inactive";

const StepperContext = React.createContext<{
	value: number;
	orientation: StepperOrientation;
} | null>(null);

function useStepperContext(componentName: string) {
	const context = React.useContext(StepperContext);
	if (!context) {
		throw new Error(`<${componentName}> must be used within <Stepper>`);
	}
	return context;
}

const StepperItemContext = React.createContext<{
	step: number;
	state: StepperStepState;
} | null>(null);

function useStepperItemContext(componentName: string) {
	const context = React.useContext(StepperItemContext);
	if (!context) {
		throw new Error(`<${componentName}> must be used within <StepperItem>`);
	}
	return context;
}

/**
 * Presentational progress indicator for multi-step flows (onboarding,
 * booking). `value` is the 1-based active step: steps below it render as
 * completed, the step equal to it as active, the rest as inactive. Navigation
 * stays with the consumer - wire buttons or router links around it.
 */
function Stepper({
	className,
	value,
	orientation = "horizontal",
	...props
}: React.ComponentProps<"ol"> & {
	value: number;
	orientation?: StepperOrientation;
}) {
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
					"group/stepper flex w-full data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-2 data-[orientation=vertical]:flex-col",
					className,
				)}
				{...props}
			/>
		</StepperContext.Provider>
	);
}

function StepperItem({
	className,
	step,
	...props
}: React.ComponentProps<"li"> & {
	step: number;
}) {
	const { value, orientation } = useStepperContext("StepperItem");
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

/**
 * Step circle: renders the step number (or custom children) and swaps to a
 * check mark once the step is completed.
 */
function StepperIndicator({
	className,
	children,
	...props
}: React.ComponentProps<"span">) {
	const { step, state } = useStepperItemContext("StepperIndicator");
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

function StepperTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="stepper-title"
			className={cn(
				"text-sm leading-tight font-medium whitespace-nowrap group-data-[state=inactive]/stepper-item:text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function StepperDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="stepper-description"
			className={cn("text-xs text-muted-foreground", className)}
			{...props}
		/>
	);
}

/**
 * Connecting line to the next step. Horizontal: a flexible rule filling the
 * gap between items. Vertical: an absolute line dropping from the indicator,
 * sized by the item's bottom padding.
 */
function StepperSeparator({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { orientation } = useStepperContext("StepperSeparator");
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

export {
	Stepper,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	type StepperStepState,
	StepperTitle,
};
