import { cn } from "@voila.dev/ui/utils";
import { useState } from "react";
import {
	collapseBreakpoints,
	type SiteHeaderCollapse,
	SiteHeaderContext,
} from "#/components/site-header/context/site-header-context.ts";
import { useScrollLock } from "#/hooks/use-scroll-lock.ts";

interface Props extends React.ComponentProps<"header"> {
	/**
	 * Whether the mobile menu starts open. Leave it off: the menu server-renders
	 * closed and hydrates, so opening by default flashes on first paint.
	 */
	defaultOpen?: boolean;
	/**
	 * The width under which the burger menu replaces the desktop nav. A header
	 * with more links than `md` can hold collapses until `xl` instead of
	 * wrapping.
	 */
	collapseBelow?: SiteHeaderCollapse;
	/** Controlled open state, paired with `onOpenChange`: lets the menu close another full-screen surface, a cart say. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

/**
 * Sticky marketing site header. Compose: Root > Bar (Brand + Nav > NavList >
 * NavItem… + Actions + MobileToggle) + MobileMenu > MobileNavItem… +
 * MobileActions. The mobile menu server-renders closed and hydrates.
 */
export function SiteHeaderRoot({
	defaultOpen = false,
	collapseBelow = "md",
	open: openProp,
	onOpenChange,
	className,
	...props
}: Props) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const isControlled = openProp !== undefined;
	const open = isControlled ? openProp : uncontrolledOpen;

	function setOpen(next: boolean) {
		if (!isControlled) setUncontrolledOpen(next);
		onOpenChange?.(next);
	}

	// The open menu is a full-screen overlay: the page behind it freezes, and
	// CSS releases the lock past the width where the menu is hidden.
	useScrollLock(open, collapseBreakpoints[collapseBelow].scrollLock);

	return (
		<SiteHeaderContext.Provider
			value={{ collapseBelow, open, setOpen, toggle: () => setOpen(!open) }}
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
