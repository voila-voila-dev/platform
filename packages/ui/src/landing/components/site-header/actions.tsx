import type * as React from "react";
import { cn } from "#/lib/utils.ts";

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
