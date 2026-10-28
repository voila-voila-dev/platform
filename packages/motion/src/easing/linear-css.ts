import type { Easing } from "#/easing/types.ts";

/** Past this many points the string grows with no visible gain. */
const MAX_POINTS = 200;

function round(value: number): string {
	return String(Math.round(value * 10_000) / 10_000);
}

/**
 * Any easing as a CSS `linear()` string, so the browser plays a spring or a
 * custom curve off the main thread. `duration` and `step` are in seconds:
 * longer motions need more points to stay smooth.
 */
export function linearEasing(
	sample: Easing,
	duration: number,
	step = 0.01,
): string {
	const intervals = Math.min(
		MAX_POINTS - 1,
		Math.max(1, Math.ceil(duration / step)),
	);
	const points: string[] = [];
	for (let index = 0; index <= intervals; index += 1) {
		points.push(round(sample(index / intervals)));
	}
	return `linear(${points.join(", ")})`;
}

let supported: boolean | undefined;

export function supportsLinearEasing(): boolean {
	if (supported === undefined) {
		if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
			return false;
		}
		supported = CSS.supports("animation-timing-function", "linear(0, 1)");
	}
	return supported;
}
