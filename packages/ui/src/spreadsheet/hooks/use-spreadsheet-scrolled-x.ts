import * as React from "react";

/**
 * Stamps `data-scrolled-x` on the scroll container while it is panned - it
 * gates the sticky column's elevation shadow. Written outside React so
 * panning never re-renders the table.
 */
export function useSpreadsheetScrolledX(
	scrollContainer: HTMLDivElement | null,
	enabled: boolean,
) {
	React.useEffect(() => {
		if (!enabled || scrollContainer === null) {
			return;
		}
		const update = () => {
			scrollContainer.toggleAttribute(
				"data-scrolled-x",
				scrollContainer.scrollLeft > 0,
			);
		};
		update();
		scrollContainer.addEventListener("scroll", update, { passive: true });
		return () => {
			scrollContainer.removeEventListener("scroll", update);
			scrollContainer.removeAttribute("data-scrolled-x");
		};
	}, [enabled, scrollContainer]);
}
