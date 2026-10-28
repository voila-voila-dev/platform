import { Menu as MenuPrimitive } from "@base-ui/react/menu";

interface Props extends MenuPrimitive.RadioGroup.Props {}

export function DropdownMenuRadioGroup(props: Props) {
	return (
		<MenuPrimitive.RadioGroup
			data-slot="dropdown-menu-radio-group"
			{...props}
		/>
	);
}
