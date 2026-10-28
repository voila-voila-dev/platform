import { useState } from "react";
import { SiteHeaderContext } from "#/landing/components/site-header/context/site-header-context.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"header"> {
	/**
	 * Whether the mobile menu starts open. Leave it off: the menu server-renders
	 * closed and hydrates, so opening by default flashes on first paint.
	 */
	defaultOpen?: boolean;
}

/**
 * Sticky marketing site header. Compose: Root > Bar (Brand + Nav > NavList >
 * NavItem… + Actions + MobileToggle) + MobileMenu > MobileNavItem… +
 * MobileActions. The mobile menu server-renders closed and hydrates.
 */
export function SiteHeaderRoot({
	defaultOpen = false,
	className,
	...props
}: Props) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<SiteHeaderContext.Provider
			value={{ open, toggle: () => setOpen((value) => !value) }}
		>
			<header
				data-slot="site-header"
				className={cn(
					"sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg",
					className,
				)}
				{...props}
			/>
		</SiteHeaderContext.Provider>
	);
}
