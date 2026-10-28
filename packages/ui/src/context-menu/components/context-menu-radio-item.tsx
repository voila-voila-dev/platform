import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { CircleIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";
import {
	menuIndicatorVariants,
	menuItemVariants,
} from "#/menu/components/menu-variants.ts";

interface Props extends ContextMenuPrimitive.RadioItem.Props {
	/** Indents the item to line up with siblings that have an icon or a checkmark. */
	inset?: boolean;
}

export function ContextMenuRadioItem({
	className,
	children,
	inset,
	...props
}: Props) {
	return (
		<ContextMenuPrimitive.RadioItem
			data-slot="context-menu-radio-item"
			data-inset={inset}
			className={cn(menuItemVariants({ indicator: "end" }), className)}
			{...props}
		>
			<span className={menuIndicatorVariants()}>
				<ContextMenuPrimitive.RadioItemIndicator>
					<CircleIcon weight="fill" className="size-2" />
				</ContextMenuPrimitive.RadioItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.RadioItem>
	);
}
