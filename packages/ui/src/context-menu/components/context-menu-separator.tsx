import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "#/lib/utils.ts";
import { menuSeparatorVariants } from "#/menu/components/menu-variants.ts";

interface Props extends ContextMenuPrimitive.Separator.Props {}

export function ContextMenuSeparator({ className, ...props }: Props) {
	return (
		<ContextMenuPrimitive.Separator
			data-slot="context-menu-separator"
			className={cn(menuSeparatorVariants(), className)}
			{...props}
		/>
	);
}
