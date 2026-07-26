import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cn } from "#/lib/utils.ts";

interface Props extends SheetPrimitive.Backdrop.Props {}

export function SheetOverlay({ className, ...props }: Props) {
	return (
		<SheetPrimitive.Backdrop
			data-slot="sheet-overlay"
			className={cn(
				// `bg-black/10` carries the dimming on light pages; on a near-black
				// dark page the blur alone does the work, so deepen the scrim there.
				"fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 supports-backdrop-filter:backdrop-blur-xs data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none dark:bg-black/40",
				className,
			)}
			{...props}
		/>
	);
}
