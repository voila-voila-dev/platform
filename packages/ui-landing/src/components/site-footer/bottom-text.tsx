import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"p"> {}

export function SiteFooterBottomText({ className, ...props }: Props) {
	return (
		<p
			data-slot="site-footer-bottom-text"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
