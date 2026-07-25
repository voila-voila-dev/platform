import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/components/button.tsx";
import { cn } from "#/lib/utils.ts";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: DialogPrimitive.Backdrop.Props) {
	return (
		<DialogPrimitive.Backdrop
			data-slot="dialog-overlay"
			className={cn(
				// `bg-black/10` carries the dimming on light pages; on a near-black
				// dark page the blur alone does the work, so deepen the scrim there.
				"fixed inset-0 isolate z-50 bg-black/10 transition-opacity duration-150 supports-backdrop-filter:backdrop-blur-xs data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none dark:bg-black/40",
				className,
			)}
			{...props}
		/>
	);
}

// `xl` is a documented extra beyond the kit's `sm | default | lg` scale for
// media-heavy dialogs (gallery lightbox, annuaire match review).
type DialogContentSize = "sm" | "default" | "lg" | "xl";

function DialogContent({
	className,
	children,
	size = "sm",
	showCloseButton = true,
	closeButtonLabel = "Close",
	overlayClassName,
	...props
}: DialogPrimitive.Popup.Props & {
	size?: DialogContentSize;
	showCloseButton?: boolean;
	closeButtonLabel?: string;
	overlayClassName?: string;
}) {
	return (
		<DialogPortal>
			<DialogOverlay className={overlayClassName} />
			<DialogPrimitive.Popup
				data-slot="dialog-content"
				data-size={size}
				className={cn(
					// The default `sm` reproduces the historical `sm:max-w-sm` width;
					// sizes are styled off `data-size`, like `AlertDialogContent`.
					"fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 transition duration-150 ease-out outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none data-[size=default]:sm:max-w-md data-[size=lg]:sm:max-w-lg data-[size=sm]:sm:max-w-sm data-[size=xl]:sm:max-w-xl",
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="dialog-close-button"
						render={
							<Button
								variant="ghost"
								className="absolute top-2 right-2"
								size="icon-sm"
							/>
						}
					>
						<XIcon />
						<span className="sr-only">{closeButtonLabel}</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Popup>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-header"
			// `pr-8` reserves room so the title never runs under the X button.
			className={cn("flex flex-col gap-2 pr-8", className)}
			{...props}
		/>
	);
}

function DialogFooter({
	className,
	closeLabel,
	children,
	...props
}: React.ComponentProps<"div"> & {
	closeLabel?: string;
}) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		>
			{closeLabel !== undefined && (
				<DialogPrimitive.Close
					data-slot="dialog-footer-close"
					render={<Button variant="outline" />}
				>
					{closeLabel}
				</DialogPrimitive.Close>
			)}
			{children}
		</div>
	);
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn(
				"text-base leading-none font-medium text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: DialogPrimitive.Description.Props) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn(
				"text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	type DialogContentSize,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
