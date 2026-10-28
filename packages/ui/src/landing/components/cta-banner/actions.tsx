import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function CtaBannerActions({ className, ...props }: Props) {
	return (
		<div
			data-slot="cta-banner-actions"
			className={cn(
				"flex flex-col justify-center gap-4 sm:flex-row",
				className,
			)}
			{...props}
		/>
	);
}
