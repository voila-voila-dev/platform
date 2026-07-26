import { Combobox as ComboboxPrimitive } from "@base-ui/react";

interface Props extends ComboboxPrimitive.Row.Props {}

export function ComboboxRow(props: Props) {
	return <ComboboxPrimitive.Row data-slot="combobox-row" {...props} />;
}
