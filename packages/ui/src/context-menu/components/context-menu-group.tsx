import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";

interface Props extends ContextMenuPrimitive.Group.Props {}

export function ContextMenuGroup(props: Props) {
	return (
		<ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
	);
}
