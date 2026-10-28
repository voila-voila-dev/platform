import { Menu as MenuPrimitive } from "@base-ui/react/menu";

interface Props extends MenuPrimitive.Root.Props {}

export function DropdownMenuRoot(props: Props) {
	return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}
