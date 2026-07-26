import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";

interface Props extends ContextMenuPrimitive.RadioGroup.Props {}

export function ContextMenuRadioGroup(props: Props) {
	return (
		<ContextMenuPrimitive.RadioGroup
			data-slot="context-menu-radio-group"
			{...props}
		/>
	);
}
