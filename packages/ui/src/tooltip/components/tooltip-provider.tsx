import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

interface Props extends TooltipPrimitive.Provider.Props {}

export function TooltipProvider({ delay = 0, ...props }: Props) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delay={delay}
			{...props}
		/>
	);
}
