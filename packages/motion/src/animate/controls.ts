import type { AnimationControls, AnimationState } from "#/animate/types.ts";

/**
 * `finished` and the `then` that makes controls awaitable:
 * `await animate(…)` waits for the end, the way Motion's controls do.
 */
export function thenable(
	finished: Promise<void>,
): Pick<AnimationControls, "finished" | "then"> {
	return {
		finished,
		// biome-ignore lint/suspicious/noThenProperty: controls are awaitable on purpose.
		then: (onFulfilled, onRejected) => finished.then(onFulfilled, onRejected),
	};
}

/**
 * One set of controls over many animations: the properties of one element,
 * the elements of a selector, the segments of a sequence. They share a clock
 * (every child's `time` counts from the same start), so scrubbing the group
 * scrubs each child at the same moment.
 */
export function groupControls(
	children: readonly AnimationControls[],
): AnimationControls {
	const finished = Promise.all(children.map((child) => child.finished)).then(
		() => undefined,
	);
	function each(action: (child: AnimationControls) => void) {
		return () => {
			for (const child of children) action(child);
		};
	}
	return {
		...thenable(finished),
		get time() {
			return Math.max(0, ...children.map((child) => child.time));
		},
		set time(seconds) {
			for (const child of children) child.time = seconds;
		},
		get speed() {
			return children[0]?.speed ?? 1;
		},
		set speed(rate) {
			for (const child of children) child.speed = rate;
		},
		get duration() {
			return Math.max(0, ...children.map((child) => child.duration));
		},
		get state(): AnimationState {
			const states = new Set(children.map((child) => child.state));
			if (states.has("running")) return "running";
			return states.has("paused") ? "paused" : "finished";
		},
		play: each((child) => child.play()),
		pause: each((child) => child.pause()),
		stop: each((child) => child.stop()),
		cancel: each((child) => child.cancel()),
		complete: each((child) => child.complete()),
		attachTimeline(timeline) {
			const attached = children.filter((child) =>
				child.attachTimeline(timeline),
			);
			if (attached.length === children.length) return true;
			// All or nothing: a half-native group would drift from its JS half.
			for (const child of attached) child.attachTimeline(document.timeline);
			return false;
		},
	};
}

/** The controls of an animation that had nothing to animate, or jumped: already finished. */
export function finishedControls(): AnimationControls {
	return groupControls([]);
}
