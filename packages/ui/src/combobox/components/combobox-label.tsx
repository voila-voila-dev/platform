import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "#/lib/utils.ts";
import { menuLabelVariants } from "#/menu/components/menu-variants.ts";

interface Props extends ComboboxPrimitive.GroupLabel.Props {}

export function ComboboxLabel({ className, ...props }: Props) {
	return (
		<ComboboxPrimitive.GroupLabel
			data-slot="combobox-label"
			className={cn(menuLabelVariants(), className)}
			{...props}
		/>
	);
}
