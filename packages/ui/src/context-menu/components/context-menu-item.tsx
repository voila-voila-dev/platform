import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "#/lib/utils.ts";
import { menuItemVariants } from "#/menu/components/menu-variants.ts";

interface Props extends ContextMenuPrimitive.Item.Props {
	/** Indents the item to line up with siblings that have an icon or a checkmark. */
	inset?: boolean;
	/** `destructive` tints the item red, for the one action that deletes something. */
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
