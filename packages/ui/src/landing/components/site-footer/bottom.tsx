import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function SiteFooterBottom({ className, ...props }: Props) {
	return (
		<div
			data-slot="site-footer-bottom"
			className={cn(
				"flex flex-col items-center justify-between gap-4 border-t border-border py-6 md:flex-row",
				className,
			)}
			{...props}
		/>
	);
}
