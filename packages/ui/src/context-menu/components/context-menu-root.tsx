import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";

interface Props extends ContextMenuPrimitive.Root.Props {}

export function ContextMenuRoot(props: Props) {
	return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}
