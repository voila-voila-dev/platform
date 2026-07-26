import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { Button } from "#/button/components/button.tsx";
import { DrawerHandle } from "#/drawer/components/drawer-handle.tsx";
import { DrawerOverlay } from "#/drawer/components/drawer-overlay.tsx";
import { DrawerPortal } from "#/drawer/components/drawer-portal.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof DrawerPrimitive.Content> {
	showHandle?: boolean;
	/** Renders an X button on `left`/`right` drawers, which have no grab handle. */
	showCloseButton?: boolean;
	closeButtonLabel?: string;
	overlayClassName?: string;
}

export function DrawerContent({
	className,
	children,
	showHandle = true,
	showCloseButton = true,
	closeButtonLabel = "Close",
	overlayClassName,
	...props
}: Props) {
	return (
		<DrawerPortal>
			<DrawerOverlay className={overlayClassName} />
			<DrawerPrimitive.Content
				data-slot="drawer-content"
				className={cn(
					"group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground ring-1 ring-foreground/10 data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm",
					className,
				)}
				{...props}
			>
				{showHandle && (
					<DrawerHandle className="hidden group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
				)}
				{children}
				{showCloseButton && (
					<DrawerPrimitive.Close asChild>
						<Button
							data-slot="drawer-close-button"
							variant="ghost"
							size="icon-sm"
							className="absolute top-2 right-2 hidden group-data-[vaul-drawer-direction=left]/drawer-content:inline-flex group-data-[vaul-drawer-direction=right]/drawer-content:inline-flex"
						>
							<XIcon />
							<span className="sr-only">{closeButtonLabel}</span>
						</Button>
					</DrawerPrimitive.Close>
				)}
			</DrawerPrimitive.Content>
		</DrawerPortal>
	);
}
