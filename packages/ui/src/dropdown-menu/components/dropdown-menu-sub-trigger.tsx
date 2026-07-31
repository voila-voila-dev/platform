import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";
import { menuSubTriggerVariants } from "#/menu/components/menu-variants.ts";

interface Props extends MenuPrimitive.SubmenuTrigger.Props {
	/** Indents the item to line up with siblings that have an icon or a checkmark. */
	inset?: boolean;
}

export function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: Props) {
	return (
		<MenuPrimitive.SubmenuTrigger
			data-slot="dropdown-menu-sub-trigger"
			data-inset={inset}
			className={cn(menuSubTriggerVariants(), className)}
			{...props}
		>
			{children}
			<CaretRightIcon className="ml-auto" />
		</MenuPrimitive.SubmenuTrigger>
	);
}
