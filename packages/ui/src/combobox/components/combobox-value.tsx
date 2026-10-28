import { Combobox as ComboboxPrimitive } from "@base-ui/react";

interface Props extends ComboboxPrimitive.Value.Props {}

export function ComboboxValue(props: Props) {
	return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}
