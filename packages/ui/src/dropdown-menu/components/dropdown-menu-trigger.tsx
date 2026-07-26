import { Menu as MenuPrimitive } from "@base-ui/react/menu";

interface Props extends MenuPrimitive.Trigger.Props {}

export function DropdownMenuTrigger(props: Props) {
	return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}
