import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

interface Props extends PopoverPrimitive.Close.Props {}

export function PopoverClose(props: Props) {
	return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}
