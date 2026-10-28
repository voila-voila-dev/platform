import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "#/lib/utils.ts";

interface Props extends ProgressPrimitive.Value.Props {}

export function ProgressValue({ className, ...props }: Props) {
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
