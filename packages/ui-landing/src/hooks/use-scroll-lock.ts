import { useEffect } from "react";

/**
 * Which viewports the lock applies to:
 * - `"all"` freezes scroll everywhere (e.g. a cart that is a side sheet on
 *   desktop and full-screen on mobile).
 * - `"mobile"` freezes scroll only below the `md` breakpoint. `landing.css`
 *   releases it above `md` on its own, so a surface that is hidden on desktop
 *   (like the burger menu) never leaves the page frozen — no resize listener.
 * - `"below-xl"` is the same below the `xl` breakpoint, for a burger menu that
 *   stays until `xl`.
 */
export type ScrollLockScope = "all" | "mobile" | "below-xl";

/**
 * Freezes page scroll while `locked` is true by flagging the document element;
 * `landing.css` turns the `data-scroll-locked` flag into `overflow: hidden`.
 * Every full-screen surface (menu, cart, …) shares this one behaviour instead
 * of juggling `document.body.style` itself.
 */
export function useScrollLock(locked: boolean, scope: ScrollLockScope = "all") {
	useEffect(() => {
		if (!locked) return;
		const root = document.documentElement;
		const previous = root.getAttribute("data-scroll-locked");
		root.setAttribute("data-scroll-locked", scope);
		return () => {
			if (previous === null) root.removeAttribute("data-scroll-locked");
			else root.setAttribute("data-scroll-locked", previous);
		};
	}, [locked, scope]);
}
