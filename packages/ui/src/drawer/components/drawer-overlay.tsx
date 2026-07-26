import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof DrawerPrimitive.Overlay> {}

export function DrawerOverlay({ className, ...props }: Props) {
	return (
		<DrawerPrimitive.Overlay
			data-slot="drawer-overlay"
			className={cn(
				// `bg-black/10` carries the dimming on light pages; on a near-black
				// dark page the blur alone does the work, so deepen the scrim there.
				"fixed inset-0 isolate z-50 bg-black/10 duration-150 supports-backdrop-filter:backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none dark:bg-black/40",
				className,
			)}
			{...props}
		/>
	);
}
