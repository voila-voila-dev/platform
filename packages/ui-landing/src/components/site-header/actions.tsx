import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"div"> {}

export function SiteHeaderActions({ className, ...props }: Props) {
	return (
		<div
			data-slot="site-header-actions"
			className={cn("flex items-center gap-3", className)}
			{...props}
		/>
	);
}
