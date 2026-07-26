import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cn } from "#/lib/utils.ts";

interface Props extends SheetPrimitive.Description.Props {}

export function SheetDescription({ className, ...props }: Props) {
	return (
		<SheetPrimitive.Description
			data-slot="sheet-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
