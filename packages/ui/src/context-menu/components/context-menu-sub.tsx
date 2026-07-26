import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";

interface Props extends ContextMenuPrimitive.SubmenuRoot.Props {}

export function ContextMenuSub(props: Props) {
	return (
		<ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
	);
}
