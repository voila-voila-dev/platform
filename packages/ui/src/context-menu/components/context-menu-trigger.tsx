import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "#/lib/utils.ts";

interface Props extends ContextMenuPrimitive.Trigger.Props {}

export function ContextMenuTrigger({ className, ...props }: Props) {
	return (
		<ContextMenuPrimitive.Trigger
			data-slot="context-menu-trigger"
			className={cn("select-none", className)}
			{...props}
		/>
	);
}
