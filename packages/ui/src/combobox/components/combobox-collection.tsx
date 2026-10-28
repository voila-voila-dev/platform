import { Combobox as ComboboxPrimitive } from "@base-ui/react";

interface Props extends ComboboxPrimitive.Collection.Props {}

export function ComboboxCollection(props: Props) {
	return (
		<ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
	);
}
