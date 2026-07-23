import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query. The initial value is read synchronously so
 * the first paint already uses the right layout (no desktop-then-mobile flash);
 * it falls back to `false` where `window` is absent.
 */
const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(() =>
		typeof window === "undefined" ? false : window.matchMedia(query).matches,
	);

	useEffect(() => {
		const list = window.matchMedia(query);
		const update = () => setMatches(list.matches);
		update();
		list.addEventListener("change", update);
		return () => list.removeEventListener("change", update);
	}, [query]);

	return matches;
};

/**
 * Touch-driven pointers. Drives the 44px tap-target floor on the block
 * toolbar, and moves that toolbar into the flow above its block instead of
 * floating it (a 44px bar has nowhere to float on a 390px viewport).
 */
export const useCoarsePointer = (): boolean =>
	useMediaQuery("(pointer: coarse)");

/**
 * Below Tailwind's `lg`, the 280px settings column no longer fits beside the
 * canvas, so « Réglages du bloc » moves into a bottom sheet reachable from the
 * selected block's toolbar.
 */
export const useCompactEditorLayout = (): boolean =>
	useMediaQuery("(max-width: 1023px)");
