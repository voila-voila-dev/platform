import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

interface Props extends PopoverPrimitive.Root.Props {}

export function PopoverRoot(props: Props) {
	return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}
