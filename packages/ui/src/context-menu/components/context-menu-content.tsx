import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "#/lib/utils.ts";
import { menuContentVariants } from "#/menu/components/menu-variants.ts";

interface Props
	extends ContextMenuPrimitive.Popup.Props,
		Pick<
			ContextMenuPrimitive.Positioner.Props,
			"align" | "alignOffset" | "side" | "sideOffset"
		> {}

export function ContextMenuContent({
	className,
	align = "start",
	alignOffset = 4,
	side = "right",
	sideOffset = 0,
	...props
}: Props) {
	return (
		<ContextMenuPrimitive.Portal>
			<ContextMenuPrimitive.Positioner
				className="isolate z-50 outline-none"
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
			>
				<ContextMenuPrimitive.Popup
					data-slot="context-menu-content"
					className={cn(menuContentVariants(), "min-w-36", className)}
					{...props}
				/>
			</ContextMenuPrimitive.Positioner>
		</ContextMenuPrimitive.Portal>
	);
}
