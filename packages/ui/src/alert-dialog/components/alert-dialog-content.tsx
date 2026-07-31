import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { AlertDialogOverlay } from "#/alert-dialog/components/alert-dialog-overlay.tsx";
import { AlertDialogPortal } from "#/alert-dialog/components/alert-dialog-portal.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends AlertDialogPrimitive.Popup.Props {
	/** Width of the panel. `sm` suits a one-line confirmation. */
	size?: "default" | "sm";
}

export function AlertDialogContent({
	className,
	size = "default",
	...props
}: Props) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Popup
				data-slot="alert-dialog-content"
				data-size={size}
				className={cn(
					"group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full max-w-xs -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none",
					className,
				)}
				{...props}
			/>
		</AlertDialogPortal>
	);
}
