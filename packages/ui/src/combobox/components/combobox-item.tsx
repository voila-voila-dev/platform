import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";
import {
	menuIndicatorVariants,
	menuItemVariants,
} from "#/menu/components/menu-variants.ts";

interface Props extends ComboboxPrimitive.Item.Props {}

export function ComboboxItem({ className, children, ...props }: Props) {
	return (
		<ComboboxPrimitive.Item
			data-slot="combobox-item"
			className={cn(
				menuItemVariants({ indicator: "end" }),
				"w-full",
				className,
			)}
			{...props}
		>
			{children}
			<ComboboxPrimitive.ItemIndicator
				render={<span className={menuIndicatorVariants()} />}
			>
				<CheckIcon className="pointer-events-none" />
			</ComboboxPrimitive.ItemIndicator>
		</ComboboxPrimitive.Item>
	);
}
