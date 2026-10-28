import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "#/lib/utils.ts";
import { menuSeparatorVariants } from "#/menu/components/menu-variants.ts";

interface Props extends ComboboxPrimitive.Separator.Props {}

export function ComboboxSeparator({ className, ...props }: Props) {
	return (
		<ComboboxPrimitive.Separator
			data-slot="combobox-separator"
			className={cn(menuSeparatorVariants(), className)}
			{...props}
		/>
	);
}
