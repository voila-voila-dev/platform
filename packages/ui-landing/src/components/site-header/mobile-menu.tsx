import { cn } from "@voila.dev/ui/utils";
import { useContext } from "react";
import { Container } from "#/components/container.tsx";
import {
	collapseBreakpoints,
	SiteHeaderContext,
} from "#/components/site-header/context/site-header-context.ts";

interface Props extends React.ComponentProps<"div"> {}

/**
 * Full-screen overlay below the bar: the list scrolls on its own while the
 * page underneath is frozen, and `MobileActions` pins to the bottom.
 */
export function SiteHeaderMobileMenu({ className, children, ...props }: Props) {
	const { collapseBelow, open } = useContext(SiteHeaderContext);

	// An explicit viewport height rather than `bottom-0`: the bar's
	// `backdrop-filter` makes the header the containing block of fixed children.
	return (
		<div
			data-slot="site-header-mobile-menu"
			className={cn(
				"fixed inset-x-0 top-16 z-40 flex h-[calc(100dvh-4rem)] flex-col bg-background",
				collapseBreakpoints[collapseBelow].mobileOnly,
				!open && "hidden",
				className,
			)}
			{...props}
		>
			<Container className="flex min-h-0 flex-1 flex-col">
				<ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain py-4">
					{children}
				</ul>
			</Container>
		</div>
	);
}
