import type * as React from "react";
import { Container } from "#/landing/components/container.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Partner/brand logo band, either an animated marquee or a static wrap. The
 * marquee keyframes live in `@voila.dev/ui/styles/landing.css`.
 */
export function LogoMarqueeRoot({ className, children, ...props }: Props) {
	return (
		<div
			data-slot="logo-marquee"
			className={cn("border-y border-border bg-muted/30 py-8", className)}
			{...props}
		>
			<Container>{children}</Container>
		</div>
	);
}
