import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cn } from "#/lib/utils.ts";

interface Props extends NavigationMenuPrimitive.Link.Props {}

export function NavigationMenuLink({ className, ...props }: Props) {
	return (
		<NavigationMenuPrimitive.Link
			data-slot="navigation-menu-link"
			className={cn(
				"flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus-visible:bg-muted [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
}
