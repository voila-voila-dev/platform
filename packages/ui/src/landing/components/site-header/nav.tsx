import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Desktop-only nav area: link list + call-to-action cluster. */
export function SiteHeaderNav({ className, ...props }: Props) {
	return (
		<div
			data-slot="site-header-nav"
			className={cn("hidden items-center gap-8 md:flex", className)}
			{...props}
		/>
	);
}
