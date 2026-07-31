import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";
import { menuSubTriggerVariants } from "#/menu/components/menu-variants.ts";

interface Props extends ContextMenuPrimitive.SubmenuTrigger.Props {
	/** Indents the item to line up with siblings that have an icon or a checkmark. */
	inset?: boolean;
}

export function ContextMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: Props) {
	return (
		<ContextMenuPrimitive.SubmenuTrigger
			data-slot="context-menu-sub-trigger"
			data-inset={inset}
			className={cn(menuSubTriggerVariants(), className)}
			{...props}
		>
			{children}
			<CaretRightIcon className="ml-auto" />
		</ContextMenuPrimitive.SubmenuTrigger>
	);
}
