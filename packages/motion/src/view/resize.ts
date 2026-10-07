import { resolveElements } from "#/view/resolve-elements.ts";

export interface Size {
	readonly width: number;
	readonly height: number;
}

export type OnElementResize = (element: Element, size: Size) => void;
export type OnWindowResize = (size: Size) => void;

// One observer for every element on the page: a ResizeObserver per call
// would multiply the browser's work by the number of animated elements.
let observer: ResizeObserver | undefined;
const elementListeners = new Map<Element, Set<OnElementResize>>();
const windowListeners = new Set<OnWindowResize>();

function boxSize(entry: ResizeObserverEntry): Size {
	const box = entry.borderBoxSize?.[0];
	return box
		? { width: box.inlineSize, height: box.blockSize }
		: { width: entry.contentRect.width, height: entry.contentRect.height };
}

function notifyElements(entries: ResizeObserverEntry[]) {
	for (const entry of entries) {
		const size = boxSize(entry);
		for (const listener of elementListeners.get(entry.target) ?? []) {
			listener(entry.target, size);
		}
	}
}

function notifyWindow() {
	const size = { width: window.innerWidth, height: window.innerHeight };
	for (const listener of windowListeners) {
		listener(size);
	}
}

function resizeWindow(onResize: OnWindowResize): () => void {
	if (windowListeners.size === 0) {
		window.addEventListener("resize", notifyWindow);
	}
	windowListeners.add(onResize);
	return () => {
		windowListeners.delete(onResize);
		if (windowListeners.size === 0) {
			window.removeEventListener("resize", notifyWindow);
		}
	};
}

function resizeElements(
	target: Element | string | readonly Element[],
	onResize: OnElementResize,
): () => void {
	if (typeof ResizeObserver === "undefined") {
		return () => {};
	}
	observer ??= new ResizeObserver(notifyElements);
	const elements = resolveElements(target);
	for (const element of elements) {
		const listeners = elementListeners.get(element) ?? new Set();
		if (listeners.size === 0) {
			elementListeners.set(element, listeners);
			observer.observe(element);
		}
		listeners.add(onResize);
	}
	return () => {
		for (const element of elements) {
			const listeners = elementListeners.get(element);
			listeners?.delete(onResize);
			if (listeners?.size === 0) {
				elementListeners.delete(element);
				observer?.unobserve(element);
			}
		}
	};
}

/**
 * Calls back when an element's border box changes size, or when the window
 * does. Returns a function that stops listening.
 */
export function resize(onResize: OnWindowResize): () => void;
export function resize(
	target: Element | string | readonly Element[],
	onResize: OnElementResize,
): () => void;
export function resize(
	targetOrListener: Element | string | readonly Element[] | OnWindowResize,
	onResize?: OnElementResize,
): () => void {
	if (typeof targetOrListener === "function") {
		return typeof window === "undefined"
			? () => {}
			: resizeWindow(targetOrListener);
	}
	return onResize ? resizeElements(targetOrListener, onResize) : () => {};
}
