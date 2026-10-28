import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";
import { navigationMenuTriggerStyle } from "#/navigation-menu/components/navigation-menu-variants.ts";

interface Props extends NavigationMenuPrimitive.Trigger.Props {}

export function NavigationMenuTrigger({
	className,
	children,
	...props
}: Props) {
	return (
		<NavigationMenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cn(navigationMenuTriggerStyle(), "group", className)}
			{...props}
		>
			{children}{" "}
			<CaretDownIcon
				className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180"
				aria-hidden="true"
			/>
		</NavigationMenuPrimitive.Trigger>
	);
}
