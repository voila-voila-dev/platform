import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import type { DialogContentSize } from "#/dialog/components/dialog.tsx";
import { DialogOverlay } from "#/dialog/components/dialog-overlay.tsx";
import { DialogPortal } from "#/dialog/components/dialog-portal.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends DialogPrimitive.Popup.Props {
	/** Width of the panel. Pick by the content, not by the importance of the task. */
	size?: DialogContentSize;
	/** Draws the X in the corner. */
	showCloseButton?: boolean;
	/** Accessible name for that X. This package ships no translations. */
	closeButtonLabel?: string;
	/** Classes for the backdrop behind the panel. `className` styles the panel itself. */
	overlayClassName?: string;
}

export function DialogContent({
	className,
	children,
	size = "sm",
	showCloseButton = true,
	closeButtonLabel = "Close",
	overlayClassName,
	...props
}: Props) {
	return (
		<DialogPortal>
			<DialogOverlay className={overlayClassName} />
			<DialogPrimitive.Popup
				data-slot="dialog-content"
				data-size={size}
				className={cn(
					// The default `sm` reproduces the historical `sm:max-w-sm` width;
					// sizes are styled off `data-size`, like `AlertDialog.Content`.
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
