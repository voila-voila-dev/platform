import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"p"> {}

export function SiteFooterBrandDescription({ className, ...props }: Props) {
	return (
		<p
			data-slot="site-footer-brand-description"
			className={cn("mb-6 max-w-sm text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
