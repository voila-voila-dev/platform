import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cn } from "#/lib/utils.ts";
import { NavigationMenuPositioner } from "#/navigation-menu/components/navigation-menu-positioner.tsx";

interface Props
	extends NavigationMenuPrimitive.Root.Props,
		Pick<
			NavigationMenuPrimitive.Positioner.Props,
			"align" | "alignOffset" | "side" | "sideOffset" | "collisionPadding"
		> {}

export function NavigationMenuRoot({
	align = "start",
	alignOffset = 0,
	side = "bottom",
	sideOffset = 8,
	collisionPadding,
	className,
	children,
	...props
}: Props) {
	return (
		<NavigationMenuPrimitive.Root
			data-slot="navigation-menu"
			className={cn(
				"group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
				className,
			)}
			{...props}
		>
			{children}
			<NavigationMenuPositioner
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
			/>
		</NavigationMenuPrimitive.Root>
	);
}
