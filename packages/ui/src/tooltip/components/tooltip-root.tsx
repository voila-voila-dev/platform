import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { TooltipProvider } from "#/tooltip/components/tooltip-provider.tsx";

interface Props
	extends TooltipPrimitive.Root.Props,
		Pick<TooltipPrimitive.Provider.Props, "delay"> {}

export function TooltipRoot({ delay, ...props }: Props) {
	return (
		<TooltipProvider delay={delay}>
			<TooltipPrimitive.Root data-slot="tooltip" {...props} />
		</TooltipProvider>
	);
}
