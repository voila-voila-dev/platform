import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "#/lib/utils.ts";

interface Props extends SelectPrimitive.Group.Props {}

export function SelectGroup({ className, ...props }: Props) {
	return (
		<SelectPrimitive.Group
			data-slot="select-group"
			className={cn("scroll-my-1", className)}
			{...props}
		/>
	);
}
