import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Clips the track and fades its cut-off edges into the band background. */
export function LogoMarqueeViewport({ className, children, ...props }: Props) {
	return (
		<div
			data-slot="logo-marquee-viewport"
			className={cn("relative overflow-hidden", className)}
			{...props}
		>
			<div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-muted/30 to-transparent" />
			<div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-muted/30 to-transparent" />
			{children}
		</div>
	);
}
