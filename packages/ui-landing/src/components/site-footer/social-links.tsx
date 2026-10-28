import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"div"> {}

export function SiteFooterSocialLinks({ className, ...props }: Props) {
	return (
		<div
			data-slot="site-footer-social-links"
			className={cn("flex items-center gap-4", className)}
			{...props}
		/>
	);
}
