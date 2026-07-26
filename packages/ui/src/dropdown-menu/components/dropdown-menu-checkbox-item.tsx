import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";
import {
	menuIndicatorVariants,
	menuItemVariants,
} from "#/menu/components/menu-variants.ts";

interface Props extends MenuPrimitive.CheckboxItem.Props {
	inset?: boolean;
}

export function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	inset,
	...props
}: Props) {
	return (
		<MenuPrimitive.CheckboxItem
			data-slot="dropdown-menu-checkbox-item"
			data-inset={inset}
			className={cn(menuItemVariants({ indicator: "end" }), className)}
			checked={checked}
			{...props}
		>
			<span
				className={menuIndicatorVariants()}
				data-slot="dropdown-menu-checkbox-item-indicator"
			>
				<MenuPrimitive.CheckboxItemIndicator>
					<CheckIcon />
				</MenuPrimitive.CheckboxItemIndicator>
			</span>
			{children}
		</MenuPrimitive.CheckboxItem>
	);
}
