import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"option"> {}

export function NativeSelectOption({ className, ...props }: Props) {
	return (
		<option
			data-slot="native-select-option"
			className={cn("bg-[Canvas] text-[CanvasText]", className)}
			{...props}
		/>
	);
}
