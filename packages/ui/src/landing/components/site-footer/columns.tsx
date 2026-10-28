import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function SiteFooterColumns({ className, ...props }: Props) {
	return (
		<div
			data-slot="site-footer-columns"
			className={cn(
				"grid gap-8 py-12 md:grid-cols-2 md:py-16 lg:grid-cols-6",
				className,
			)}
			{...props}
		/>
	);
}
