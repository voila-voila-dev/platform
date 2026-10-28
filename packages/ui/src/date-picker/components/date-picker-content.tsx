import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { Popover } from "#/popover/components/popover.tsx";

interface Props extends React.ComponentProps<typeof Popover.Content> {}

export function DatePickerContent({
	className,
	align = "start",
	...props
}: Props) {
	return (
		<Popover.Content
			data-slot="date-picker-content"
			className={cn("w-auto p-0", className)}
			align={align}
			{...props}
		/>
	);
}
