import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";

// Unlike the Base UI overlays in this kit, the drawer is Radix-based (vaul):
// compose with `asChild` (not `render`) and style against `data-state`.

function Drawer({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
	return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
	return <DrawerPrimitive.Portal {...props} />;
}

function DrawerClose({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
	return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
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

function DrawerHandle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="drawer-handle"
			aria-hidden="true"
			className={cn(
				"mx-auto mt-4 h-1 w-24 shrink-0 rounded-full bg-muted-foreground/20",
				className,
			)}
			{...props}
		/>
	);
}

function DrawerContent({
	className,
	children,
	showHandle = true,
	showCloseButton = true,
	closeButtonLabel = "Close",
	overlayClassName,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
	showHandle?: boolean;
	/** Renders an X button on `left`/`right` drawers, which have no grab handle. */
	showCloseButton?: boolean;
	closeButtonLabel?: string;
	overlayClassName?: string;
}) {
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

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="drawer-header"
			className={cn(
				// `pr-8` on side drawers reserves room so the title never runs under
				// the X button; bottom/top drawers center on mobile, left-align on md+.
				"flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=left]/drawer-content:pr-8 group-data-[vaul-drawer-direction=right]/drawer-content:pr-8 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left md:group-data-[vaul-drawer-direction=top]/drawer-content:text-left",
				className,
			)}
			{...props}
		/>
	);
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="drawer-footer"
			className={cn("mt-auto flex flex-col gap-2 p-4", className)}
			{...props}
		/>
	);
}

function DrawerTitle({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
	return (
		<DrawerPrimitive.Title
			data-slot="drawer-title"
			className={cn("text-base font-medium text-foreground", className)}
			{...props}
		/>
	);
}

function DrawerDescription({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
	return (
		<DrawerPrimitive.Description
			data-slot="drawer-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHandle,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
};
