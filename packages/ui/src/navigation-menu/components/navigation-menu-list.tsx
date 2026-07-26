import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cn } from "#/lib/utils.ts";

interface Props extends NavigationMenuPrimitive.List.Props {}

export function NavigationMenuList({ className, ...props }: Props) {
	return (
		<NavigationMenuPrimitive.List
			data-slot="navigation-menu-list"
			className={cn(
				"group flex flex-1 list-none items-center justify-center gap-0",
				className,
			)}
			{...props}
		/>
	);
}
