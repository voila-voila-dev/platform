import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	/** Seconds for one loop of the marquee. */
	duration?: number;
}

/**
 * Auto-scrolling track. Children are rendered twice (second pass
 * `aria-hidden`, laid out flat via `display: contents`) so the -50%
 * translation loops seamlessly. Pauses on hover.
 */
export function LogoMarqueeTrack({
	duration = 30,
	className,
	style,
	children,
	...props
}: Props) {
	return (
		<div
			data-slot="logo-marquee-track"
			className={cn(
				"flex animate-[landing-marquee_30s_linear_infinite] items-center gap-12 hover:[animation-play-state:paused]",
				className,
			)}
			style={{ animationDuration: `${duration}s`, ...style }}
			{...props}
		>
			{children}
			<div aria-hidden="true" className="contents">
				{children}
			</div>
		</div>
	);
}
