import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"div"> {}

/** Icon tile + text laid out side by side. */
export function BentoGridItemLayout({ className, ...props }: Props) {
	return (
		<div
			data-slot="bento-item-layout"
			className={cn("flex items-start gap-4", className)}
			{...props}
		/>
	);
}
