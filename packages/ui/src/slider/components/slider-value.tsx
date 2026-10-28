import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "#/lib/utils.ts";

interface Props extends SliderPrimitive.Value.Props {}

export function SliderValue({ className, ...props }: Props) {
	return (
		<SliderPrimitive.Value
			data-slot="slider-value"
			className={cn("text-sm text-muted-foreground tabular-nums", className)}
			{...props}
		/>
	);
}
