import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

interface Props extends TooltipPrimitive.Trigger.Props {}

export function TooltipTrigger(props: Props) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}
