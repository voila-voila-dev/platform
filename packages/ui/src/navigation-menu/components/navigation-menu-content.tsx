import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cn } from "#/lib/utils.ts";

interface Props extends NavigationMenuPrimitive.Content.Props {}

export function NavigationMenuContent({ className, ...props }: Props) {
	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-menu-content"
			className={cn(
				"h-full w-auto p-1 transition-[opacity,transform,translate] duration-350 ease-fluid data-starting-style:opacity-0 data-starting-style:data-[activation-direction=left]:translate-x-[-50%] data-starting-style:data-[activation-direction=right]:translate-x-[50%] data-ending-style:opacity-0 data-ending-style:data-[activation-direction=left]:translate-x-[50%] data-ending-style:data-[activation-direction=right]:translate-x-[-50%] motion-reduce:transition-none **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
				className,
			)}
			{...props}
		/>
	);
}
