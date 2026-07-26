import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import { cn } from "#/lib/utils.ts";
import { SheetOverlay } from "#/sheet/components/sheet-overlay.tsx";
import { SheetPortal } from "#/sheet/components/sheet-portal.tsx";

// `xl` and `full` are documented extras beyond the kit's `sm | default | lg`
// scale for wide editing panels and full-bleed surfaces.
export type SheetContentSize = "sm" | "default" | "lg" | "xl" | "full";

interface Props extends SheetPrimitive.Popup.Props {
	side?: "top" | "right" | "bottom" | "left";
	size?: SheetContentSize;
	showCloseButton?: boolean;
	closeButtonLabel?: string;
	overlayClassName?: string;
}

export function SheetContent({
	className,
	children,
	side = "right",
	size = "default",
	showCloseButton = true,
	closeButtonLabel = "Close",
	overlayClassName,
	...props
}: Props) {
	return (
		<SheetPortal>
			<SheetOverlay className={overlayClassName} />
			<SheetPrimitive.Popup
				data-slot="sheet-content"
				data-side={side}
				data-size={size}
				className={cn(
					"fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:rounded-t-xl data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:rounded-r-xl data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:rounded-l-xl data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:rounded-b-xl data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem]",
					// `size` only constrains the left/right panels (top/bottom are
					// content-height, full-bleed). Styled off `data-size` (like
					// `AlertDialog.Content`); the default reproduces the historical
					// `sm:max-w-sm` width.
					"data-[size=default]:data-[side=left]:sm:max-w-sm data-[size=default]:data-[side=right]:sm:max-w-sm data-[size=full]:data-[side=left]:w-full data-[size=full]:data-[side=left]:max-w-none data-[size=full]:data-[side=right]:w-full data-[size=full]:data-[side=right]:max-w-none data-[size=lg]:data-[side=left]:sm:max-w-md data-[size=lg]:data-[side=right]:sm:max-w-md data-[size=sm]:data-[side=left]:sm:max-w-xs data-[size=sm]:data-[side=right]:sm:max-w-xs data-[size=xl]:data-[side=left]:sm:max-w-lg data-[size=xl]:data-[side=right]:sm:max-w-lg",
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<SheetPrimitive.Close
						data-slot="sheet-close-button"
						render={
							<Button
								variant="ghost"
								className="absolute top-3 right-3"
								size="icon-sm"
							/>
						}
					>
						<XIcon />
						<span className="sr-only">{closeButtonLabel}</span>
					</SheetPrimitive.Close>
				)}
			</SheetPrimitive.Popup>
		</SheetPortal>
	);
}
