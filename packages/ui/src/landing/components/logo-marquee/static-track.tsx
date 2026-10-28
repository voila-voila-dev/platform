import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Non-animated alternative: centered wrapping row of logos. */
export function LogoMarqueeStaticTrack({ className, ...props }: Props) {
	return (
		<div
			data-slot="logo-marquee-static-track"
			className={cn(
				"flex flex-wrap items-center justify-center gap-12",
				className,
			)}
			{...props}
		/>
	);
}
