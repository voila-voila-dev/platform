import { Combobox as ComboboxPrimitive } from "@base-ui/react";

interface Props extends ComboboxPrimitive.Group.Props {}

export function ComboboxGroup(props: Props) {
	return <ComboboxPrimitive.Group data-slot="combobox-group" {...props} />;
}
