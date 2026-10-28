import { createContext } from "react";
import type { ScrollLockScope } from "#/hooks/use-scroll-lock.ts";

export type SiteHeaderCollapse = "md" | "xl";

/** The classes and scroll-lock scope each collapse width resolves to. */
export const collapseBreakpoints: Record<
	SiteHeaderCollapse,
	{ nav: string; mobileOnly: string; scrollLock: ScrollLockScope }
> = {
	md: { nav: "md:flex", mobileOnly: "md:hidden", scrollLock: "mobile" },
	xl: { nav: "xl:flex", mobileOnly: "xl:hidden", scrollLock: "below-xl" },
};

interface SiteHeaderContextValue {
	collapseBelow: SiteHeaderCollapse;
	open: boolean;
	setOpen: (open: boolean) => void;
	toggle: () => void;
}

function withoutMenu(): void {
	// Outside a SiteHeader.Root there is no menu to open or close.
}

/** Mobile-menu state, set by `SiteHeader.Root`. */
export const SiteHeaderContext = createContext<SiteHeaderContextValue>({
	collapseBelow: "md",
	open: false,
	setOpen: withoutMenu,
	toggle: withoutMenu,
});
