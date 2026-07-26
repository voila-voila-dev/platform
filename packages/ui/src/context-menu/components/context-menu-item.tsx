import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "#/lib/utils.ts";
import { menuItemVariants } from "#/menu/components/menu-variants.ts";

interface Props extends ContextMenuPrimitive.Item.Props {
	inset?: boolean;
	variant?: "default" | "destructive";
}

export function ContextMenuItem({
	className,
	inset,
	variant = "default",
	...props
}: Props) {
	return (
		<ContextMenuPrimitive.Item
			data-slot="context-menu-item"
			data-inset={inset}
			data-variant={variant}
			className={cn(menuItemVariants({ variant }), className)}
			{...props}
		/>
	);
}
