import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "#/lib/utils.ts";
import { menuItemVariants } from "#/menu/components/menu-variants.ts";

interface Props extends MenuPrimitive.Item.Props {
	inset?: boolean;
	variant?: "default" | "destructive";
}

export function DropdownMenuItem({
	className,
	inset,
	variant = "default",
	...props
}: Props) {
	return (
		<MenuPrimitive.Item
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-variant={variant}
			className={cn(menuItemVariants({ variant }), className)}
			{...props}
		/>
	);
}
