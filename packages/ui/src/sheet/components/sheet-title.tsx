import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cn } from "#/lib/utils.ts";

interface Props extends SheetPrimitive.Title.Props {}

export function SheetTitle({ className, ...props }: Props) {
	return (
		<SheetPrimitive.Title
			data-slot="sheet-title"
			className={cn("text-base font-medium text-foreground", className)}
			{...props}
		/>
	);
}
