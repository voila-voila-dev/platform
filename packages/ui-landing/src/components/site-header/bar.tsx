import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { Container } from "#/components/container.tsx";

interface Props extends React.ComponentProps<"nav"> {
	"aria-label"?: string;
}

export function SiteHeaderBar({
	className,
	children,
	"aria-label": ariaLabel = "Main",
	...props
}: Props) {
	return (
		<Container>
			<nav
				data-slot="site-header-bar"
				aria-label={ariaLabel}
				className={cn("flex h-16 items-center justify-between", className)}
				{...props}
			>
				{children}
			</nav>
		</Container>
	);
}
