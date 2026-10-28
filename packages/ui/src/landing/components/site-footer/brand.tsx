import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Brand column — logo + description + social links; spans two columns. */
export function SiteFooterBrand({ className, ...props }: Props) {
	return (
		<div
			data-slot="site-footer-brand"
			className={cn("lg:col-span-2", className)}
			{...props}
		/>
	);
}
