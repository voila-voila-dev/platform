import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "#/lib/utils.ts";

interface Props extends ComboboxPrimitive.List.Props {}

export function ComboboxList({ className, ...props }: Props) {
	return (
		<ComboboxPrimitive.List
			data-slot="combobox-list"
			// max-height caps the list at 72 spacing units (18rem) or the available
			// popup height, whichever is smaller, minus 9 units (2.25rem) reserved
			// for an in-popup input group (command-style search) when present.
			className={cn(
				"no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
				className,
			)}
			{...props}
		/>
	);
}
