import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "#/lib/utils.ts";

interface Props extends SelectPrimitive.Separator.Props {}

export function SelectSeparator({ className, ...props }: Props) {
	return (
		<SelectPrimitive.Separator
			data-slot="select-separator"
			className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
			{...props}
		/>
	);
}
