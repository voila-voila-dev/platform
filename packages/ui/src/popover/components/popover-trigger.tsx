import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

interface Props extends PopoverPrimitive.Trigger.Props {}

export function PopoverTrigger(props: Props) {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}
