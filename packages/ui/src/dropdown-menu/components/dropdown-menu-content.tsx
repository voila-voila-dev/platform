import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "#/lib/utils.ts";
import { menuContentVariants } from "#/menu/components/menu-variants.ts";

interface Props
	extends MenuPrimitive.Popup.Props,
		Pick<
			MenuPrimitive.Positioner.Props,
			"align" | "alignOffset" | "side" | "sideOffset"
		> {}

export function DropdownMenuContent({
	align = "start",
	alignOffset = 0,
	side = "bottom",
	sideOffset = 4,
	className,
	...props
}: Props) {
	return (
		<MenuPrimitive.Portal>
			<MenuPrimitive.Positioner
				className="isolate z-50 outline-none"
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
			>
				<MenuPrimitive.Popup
					data-slot="dropdown-menu-content"
					className={cn(menuContentVariants(), className)}
					{...props}
				/>
			</MenuPrimitive.Positioner>
		</MenuPrimitive.Portal>
	);
}
