import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { XIcon } from "@phosphor-icons/react";
import { InputGroup } from "#/input-group/components/input-group.tsx";

interface Props extends ComboboxPrimitive.Clear.Props {}

export function ComboboxClear({
	"aria-label": ariaLabel = "Clear selection",
	...props
}: Props) {
	return (
		<ComboboxPrimitive.Clear
			data-slot="combobox-clear"
			aria-label={ariaLabel}
			render={<InputGroup.Button variant="ghost" size="icon-xs" />}
			{...props}
		>
			<XIcon className="pointer-events-none" />
		</ComboboxPrimitive.Clear>
	);
}
