import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"ul"> {}

export function ComparisonPanelList({ className, ...props }: Props) {
	return (
		<ul
			data-slot="comparison-panel-list"
			className={cn("space-y-3", className)}
			{...props}
		/>
	);
}
