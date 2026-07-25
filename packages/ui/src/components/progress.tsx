import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "#/lib/utils.ts";

type ProgressProps = ProgressPrimitive.Root.Props & {
	trackClassName?: string;
	indicatorClassName?: string;
};

/**
 * Children render before the track in a wrapping flex row, so a
 * ProgressLabel + ProgressValue pair forms a header row and the full-width
 * track wraps below it. Pass `value={null}` for an indeterminate bar.
 */
function Progress({
	className,
	children,
	trackClassName,
	indicatorClassName,
	...props
}: ProgressProps) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn("flex flex-wrap gap-3", className)}
			{...props}
		>
			{children}
			<ProgressPrimitive.Track
				data-slot="progress-track"
				className={cn(
					"relative flex h-1 w-full items-center overflow-hidden rounded-full bg-muted",
					trackClassName,
				)}
			>
				<ProgressPrimitive.Indicator
					data-slot="progress-indicator"
					className={cn(
						"h-full bg-primary transition-[width] motion-reduce:transition-none data-indeterminate:w-1/2 data-indeterminate:animate-progress-indeterminate data-indeterminate:motion-reduce:animate-[progress-indeterminate_4s_linear_infinite]",
						indicatorClassName,
					)}
				/>
			</ProgressPrimitive.Track>
		</ProgressPrimitive.Root>
	);
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
	return (
		<ProgressPrimitive.Label
			data-slot="progress-label"
			className={cn("text-sm font-medium", className)}
			{...props}
		/>
	);
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
	return (
		<ProgressPrimitive.Value
			data-slot="progress-value"
			className={cn(
				"ml-auto text-sm text-muted-foreground tabular-nums",
				className,
			)}
			{...props}
		/>
	);
}

export { Progress, ProgressLabel, ProgressValue };
