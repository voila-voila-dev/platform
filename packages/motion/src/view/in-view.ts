import { resolveElements } from "#/view/resolve-elements.ts";

export type InViewAmount = "some" | "all" | number;

export interface InViewOptions {
	/** The scrolling ancestor to intersect with; the viewport by default. */
	readonly root?: Element | Document;
	/** Grows or shrinks the root's box, CSS margin syntax: "0px 0px -20% 0px". */
	readonly margin?: string;
	/** How much of the element must show: any pixel, all of it, or a fraction. */
	readonly amount?: InViewAmount;
}

export type OnViewEnd = (entry: IntersectionObserverEntry) => void;
export type OnViewStart = (
	element: Element,
	entry: IntersectionObserverEntry,
) => undefined | OnViewEnd;

const THRESHOLDS: Readonly<Record<"some" | "all", number>> = {
	some: 0,
	all: 1,
};

/**
 * Calls `onStart` when an element comes into view. When it returns a
 * function, that runs when the element leaves and `onStart` runs again on
 * the next entry; otherwise the element fires once. Returns a function that
 * stops observing.
 */
export function inView(
	target: Element | string | readonly Element[],
	onStart: OnViewStart,
	options: InViewOptions = {},
): () => void {
	const elements = resolveElements(target);
	if (elements.length === 0 || typeof IntersectionObserver === "undefined") {
		return () => {};
	}
	const amount = options.amount ?? "some";
	const threshold = typeof amount === "number" ? amount : THRESHOLDS[amount];
	const active = new Map<Element, OnViewEnd>();

	function onIntersect(entries: IntersectionObserverEntry[]) {
		for (const entry of entries) {
			// Chromium reports a fully visible box as 0.99… on fractional layouts.
			const visible =
				entry.isIntersecting && entry.intersectionRatio + 1e-3 >= threshold;
			const onEnd = active.get(entry.target);
			if (visible && onEnd === undefined) {
				const next = onStart(entry.target, entry);
				if (typeof next === "function") {
					active.set(entry.target, next);
				} else {
					observer.unobserve(entry.target);
				}
			}
			if (!visible && onEnd !== undefined) {
				active.delete(entry.target);
				onEnd(entry);
			}
		}
	}

	const observer = new IntersectionObserver(onIntersect, {
		root: options.root,
		rootMargin: options.margin,
		threshold,
	});
	for (const element of elements) {
		observer.observe(element);
	}
	return () => observer.disconnect();
}
