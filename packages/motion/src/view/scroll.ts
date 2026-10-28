import { cancelFrame, frame } from "#/frame/frame.ts";
import { resize } from "#/view/resize.ts";
import {
	documentScroller,
	measureScroll,
	type ScrollAxis,
} from "#/view/scroll-measure.ts";
import {
	ENTER_TO_EXIT,
	FULL_RANGE,
	type ScrollOffset,
	scrollProgress,
} from "#/view/scroll-offset.ts";

/** What `animate()` returns, seen from the scroll side. */
export interface ScrollDrivable {
	time: number;
	readonly duration: number;
	/** Hands the native timeline to WAAPI animations; false when it can't (JS-driven). */
	attachTimeline?(timeline: AnimationTimeline): boolean;
	/** Scroll alone moves it once driven: its own clock must stop. */
	pause?(): void;
}

export interface ScrollInfo {
	readonly progress: number;
	/** Pixels scrolled along the axis. */
	readonly scroll: number;
	/** The furthest the container can scroll along the axis. */
	readonly scrollLength: number;
	readonly axis: ScrollAxis;
}

export interface ScrollOptions {
	/** The scrolling element; the page by default. */
	readonly container?: Element;
	/** Track this element crossing the container instead of the whole scroll range. */
	readonly target?: Element;
	readonly axis?: ScrollAxis;
	readonly offset?: ScrollOffset;
}

export type OnScroll = (progress: number, info: ScrollInfo) => void;

type TimelineConstructor = new (options: object) => AnimationTimeline;

function sameOffset(a: ScrollOffset, b: ScrollOffset): boolean {
	return String(a[0]) === String(b[0]) && String(a[1]) === String(b[1]);
}

/**
 * The browser's own timeline, which runs the animation off the main thread.
 * Only for the offsets a bare timeline means by itself: the full range for
 * a ScrollTimeline, enter-to-exit ("cover") for a ViewTimeline.
 */
function nativeTimeline(
	container: Element,
	axis: ScrollAxis,
	target: Element | undefined,
	offset: ScrollOffset,
): AnimationTimeline | undefined {
	const scope = globalThis as unknown as Record<string, TimelineConstructor>;
	const Timeline = target ? scope.ViewTimeline : scope.ScrollTimeline;
	const expected = target ? ENTER_TO_EXIT : FULL_RANGE;
	if (Timeline === undefined || !sameOffset(offset, expected)) {
		return undefined;
	}
	return target
		? new Timeline({ subject: target, axis })
		: new Timeline({ source: container, axis });
}

/**
 * Drives a callback, or an animation's time, from scroll progress. Returns a
 * function that stops listening.
 */
export function scroll(
	onScroll: OnScroll | ScrollDrivable,
	options: ScrollOptions = {},
): () => void {
	const container = options.container ?? documentScroller();
	const axis = options.axis ?? "y";
	const target = options.target;
	const offset = options.offset ?? (target ? ENTER_TO_EXIT : FULL_RANGE);

	if (typeof onScroll !== "function" && onScroll.attachTimeline) {
		const timeline = nativeTimeline(container, axis, target, offset);
		if (timeline && onScroll.attachTimeline(timeline)) {
			return () => {};
		}
	}

	if (typeof onScroll !== "function") onScroll.pause?.();
	const apply: OnScroll =
		typeof onScroll === "function"
			? onScroll
			: (progress) => {
					onScroll.time = progress * onScroll.duration;
				};
	let info: ScrollInfo | undefined;
	let scheduled = false;

	function update() {
		if (info) {
			apply(info.progress, info);
		}
	}
	function measure() {
		scheduled = false;
		const measured = measureScroll(container, axis, target);
		info = {
			progress: scrollProgress(measured.scroll, offset, measured.geometry),
			scroll: measured.scroll,
			scrollLength: measured.scrollLength,
			axis,
		};
		frame.update(update);
	}
	function schedule() {
		if (!scheduled) {
			scheduled = true;
			frame.read(measure);
		}
	}

	// The page scroller fires its scroll events on window, not on itself.
	const eventSource: EventTarget =
		container === documentScroller() ? window : container;
	eventSource.addEventListener("scroll", schedule, { passive: true });
	const stopResize = [
		resize(schedule),
		resize(target ? [container, target] : [container], schedule),
	];
	schedule();
	return () => {
		eventSource.removeEventListener("scroll", schedule);
		for (const stop of stopResize) {
			stop();
		}
		cancelFrame(measure);
		cancelFrame(update);
	};
}
