import { createContext } from "react";

interface SiteHeaderContextValue {
	open: boolean;
	toggle: () => void;
}

/** Mobile-menu open state, set by `SiteHeader.Root`. */
export const SiteHeaderContext = createContext<SiteHeaderContextValue>({
	open: false,
	toggle: () => {},
});
