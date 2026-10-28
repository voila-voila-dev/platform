import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "#/lib/utils.ts";

interface Props extends PopoverPrimitive.Description.Props {}

export function PopoverDescription({ className, ...props }: Props) {
	return (
		<PopoverPrimitive.Description
			data-slot="popover-description"
			className={cn("text-muted-foreground", className)}
			{...props}
		/>
	);
}
