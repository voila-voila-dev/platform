import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "#/lib/utils.ts";

interface Props extends SelectPrimitive.GroupLabel.Props {}

export function SelectLabel({ className, ...props }: Props) {
	return (
		<SelectPrimitive.GroupLabel
			data-slot="select-label"
			className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
			{...props}
		/>
	);
}
