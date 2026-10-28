import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";

interface Props extends ContextMenuPrimitive.Portal.Props {}

export function ContextMenuPortal(props: Props) {
	return (
		<ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
	);
}
