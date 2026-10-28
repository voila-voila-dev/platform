import { useCallback, useRef } from "react";

/**
 * Remembers which sidebar sections the reader has opened.
 *
 * The docs layout remounts on every navigation, so a `defaultOpen` computed
 * from the active page is re-evaluated each time: open `@voila.dev/ui`, click
 * a component, and the group you were reading collapses again. That closed the
 * sidebar under you exactly when you were working through a section.
 *
 * The Collapsible stays **uncontrolled**. Driving it with `open` instead made
 * the group render expanded on the server and then collapse on hydration —
 * worse than the bug being fixed. So this only supplies the initial value and
 * records what the reader does with it; the Collapsible owns its state for the
 * lifetime of the mount, and the next mount reads what was remembered.
 *
 * The store is a module-level `Map` rather than `sessionStorage`: a module
 * outlives the remount, which is the whole problem, and reading it needs no
 * effect, so the first client render still matches the prerendered HTML. A
 * full page load starts from the defaults again, which is the right default —
 * you arrived somewhere new.
 */
const openState = new Map<string, boolean>();

export function useSidebarOpenState(
	key: string,
	fallback: boolean,
): [boolean, (open: boolean) => void] {
	// Read once per mount. Later reads would disagree with what the
	// uncontrolled Collapsible is already showing.
	const initial = useRef(openState.get(key) ?? fallback);

	const remember = useCallback(
		(open: boolean) => {
			openState.set(key, open);
		},
		[key],
	);

	return [initial.current, remember];
}
