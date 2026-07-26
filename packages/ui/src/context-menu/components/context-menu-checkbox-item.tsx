import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";
import {
	menuIndicatorVariants,
	menuItemVariants,
} from "#/menu/components/menu-variants.ts";

interface Props extends ContextMenuPrimitive.CheckboxItem.Props {
	inset?: boolean;
}

export function ContextMenuCheckboxItem({
	className,
	children,
	checked,
	inset,
	...props
}: Props) {
	return (
		<ContextMenuPrimitive.CheckboxItem
			data-slot="context-menu-checkbox-item"
			data-inset={inset}
			className={cn(menuItemVariants({ indicator: "end" }), className)}
			checked={checked}
			{...props}
		>
			<span className={menuIndicatorVariants()}>
				<ContextMenuPrimitive.CheckboxItemIndicator>
					<CheckIcon />
				</ContextMenuPrimitive.CheckboxItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.CheckboxItem>
	);
}
