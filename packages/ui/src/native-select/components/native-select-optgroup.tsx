import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"optgroup"> {}

export function NativeSelectOptGroup({ className, ...props }: Props) {
	return (
		<optgroup
			data-slot="native-select-optgroup"
			className={cn("bg-[Canvas] text-[CanvasText]", className)}
			{...props}
		/>
	);
}
