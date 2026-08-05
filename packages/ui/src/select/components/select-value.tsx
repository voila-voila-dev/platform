import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "#/lib/utils.ts";

interface Props extends SelectPrimitive.Value.Props {}

export function SelectValue({ className, ...props }: Props) {
	return (
		<SelectPrimitive.Value
			data-slot="select-value"
			// `block`, not `flex`: an ellipsis needs a block container, and a value
			// long enough to overflow is the common case for a name typed by a user.
			className={cn("block min-w-0 flex-1 text-left", className)}
			{...props}
		/>
	);
}
