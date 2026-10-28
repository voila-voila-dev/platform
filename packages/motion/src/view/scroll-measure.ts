import type { ScrollGeometry } from "#/view/scroll-offset.ts";

export type ScrollAxis = "x" | "y";

interface AxisKeys {
	readonly scroll: "scrollTop" | "scrollLeft";
	readonly scrollLength: "scrollHeight" | "scrollWidth";
	readonly client: "clientHeight" | "clientWidth";
	readonly clientStart: "clientTop" | "clientLeft";
	readonly rectStart: "top" | "left";
	readonly rectLength: "height" | "width";
}

const AXES: Readonly<Record<ScrollAxis, AxisKeys>> = {
	y: {
		scroll: "scrollTop",
		scrollLength: "scrollHeight",
		client: "clientHeight",
		clientStart: "clientTop",
		rectStart: "top",
		rectLength: "height",
	},
	x: {
		scroll: "scrollLeft",
		scrollLength: "scrollWidth",
		client: "clientWidth",
		clientStart: "clientLeft",
		rectStart: "left",
		rectLength: "width",
	},
};

/** The page's own scroller, which reports its scroll events on `window`. */
export function documentScroller(): Element {
	return document.scrollingElement ?? document.documentElement;
}

export interface ScrollMeasurement {
	readonly scroll: number;
	/** The furthest the container can scroll along the axis. */
	readonly scrollLength: number;
	readonly geometry: ScrollGeometry;
}

/**
 * Reads layout, so it belongs in the frame's read phase only. Without a
 * target, the target is the scrolled content itself.
 */
export function measureScroll(
	container: Element,
	axis: ScrollAxis,
	target: Element | undefined,
): ScrollMeasurement {
	const keys = AXES[axis];
	const scroll = container[keys.scroll];
	const viewportLength = container[keys.client];
	const contentLength = container[keys.scrollLength];
	const scrollLength = Math.max(0, contentLength - viewportLength);
	if (target === undefined) {
		return {
			scroll,
			scrollLength,
			geometry: { targetStart: 0, targetLength: contentLength, viewportLength },
		};
	}
	// The page scroller's own rect moves with its scroll; its scrollport is
	// the viewport, which starts at 0.
	const scrollportStart =
		container === documentScroller()
			? 0
			: container.getBoundingClientRect()[keys.rectStart] +
				container[keys.clientStart];
	const targetRect = target.getBoundingClientRect();
	return {
		scroll,
		scrollLength,
		geometry: {
			targetStart: targetRect[keys.rectStart] - scrollportStart + scroll,
			targetLength: targetRect[keys.rectLength],
			viewportLength,
		},
	};
}
