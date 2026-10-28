import { Menu as MenuPrimitive } from "@base-ui/react/menu";

interface Props extends MenuPrimitive.Group.Props {}

export function DropdownMenuGroup(props: Props) {
	return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}
