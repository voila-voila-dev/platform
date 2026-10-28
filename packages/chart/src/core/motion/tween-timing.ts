import { type EasingName, tween as tweenGenerator } from "@voila.dev/motion";
import { type ChartTiming, DEFAULT_DURATION } from "#/core/motion/timing.ts";

export interface ChartTweenOptions {
	/** Milliseconds. */
	readonly duration?: number;
	readonly easing?: EasingName;
	/** Milliseconds between marks in focus order, capped at 300 ms in all. */
	readonly stagger?: number;
}

/**
 * A fixed curve instead of the spring, for `<Chart animate={tween()} />`.
 * Its own import, so the easings only load in a chart that asks for them.
 * The options stay on the timing as plain fields: `<Chart>` reads an inline
 * `animate` by value, and a function alone would not tell two tweens apart.
 */
export function tween(
	options: ChartTweenOptions = {},
): ChartTiming & ChartTweenOptions {
	const duration = options.duration ?? DEFAULT_DURATION;
	const easing = options.easing ?? "easeOut";
	return {
		duration,
		easing,
		stagger: (options.stagger ?? 0) / 1000,
		motion(from, to) {
			return tweenGenerator({
				keyframes: [from, to],
				duration: duration / 1000,
				ease: easing,
			});
		},
	};
}
