import { Menu as MenuPrimitive } from "@base-ui/react/menu";

interface Props extends MenuPrimitive.Portal.Props {}

export function DropdownMenuPortal(props: Props) {
	return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}
