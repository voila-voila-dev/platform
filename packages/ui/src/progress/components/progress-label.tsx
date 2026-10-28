import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "#/lib/utils.ts";

interface Props extends ProgressPrimitive.Label.Props {}

export function ProgressLabel({ className, ...props }: Props) {
	return (
		<ProgressPrimitive.Label
			data-slot="progress-label"
			className={cn("text-sm font-medium", className)}
			{...props}
		/>
	);
}
