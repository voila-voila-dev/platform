import { type Generator, spring } from "@voila.dev/motion";

/**
 * How every channel of a chart moves on an update. The store only asks it
 * for one channel's motion, so a chart that never tweens never loads the
 * tween: `tween()` builds one, the default is a spring.
 */
export interface ChartTiming {
	/** Seconds between neighbours. */
	readonly stagger: number;
	/** One channel from `from` to `to`, leaving at `velocity` (units per second). */
	motion(from: number, to: number, velocity: number): Generator;
}

/** The spring `<Chart animate>` takes beyond `true`, `false` and a duration. */
export interface ChartSpring {
	/** Perceived duration, in milliseconds. */
	readonly duration?: number;
	/** 0 never overshoots (the default: a bar past its value shows a number the data doesn't have); up to 0.5. */
	readonly bounce?: number;
	/** Milliseconds between marks in focus order, capped at 300 ms in all. */
	readonly stagger?: number;
}

export type ChartAnimation = ChartSpring | ChartTiming;

export const DEFAULT_DURATION = 300;
const MAX_STAGGER_TOTAL = 0.3;

/** The timing an `animate` prop means, or `null` to snap. */
export function chartTiming(
	animate: boolean | number | ChartAnimation,
): ChartTiming | null {
	if (animate === false || animate === 0) return null;
	if (typeof animate === "object" && "motion" in animate) return animate;
	const options: ChartSpring =
		typeof animate === "object"
			? animate
			: { duration: animate === true ? DEFAULT_DURATION : animate };
	const duration = (options.duration ?? DEFAULT_DURATION) / 1000;
	const bounce = Math.min(Math.max(options.bounce ?? 0, 0), 0.5);
	return {
		stagger: (options.stagger ?? 0) / 1000,
		motion(from, to, velocity) {
			return spring({ from, to, velocity, duration, bounce });
		},
	};
}

/** The delay of the `index`-th of `count` marks: the gap shrinks so the last one never waits more than 300 ms. */
export function staggerDelay(
	timing: ChartTiming,
	index: number,
	count: number,
): number {
	if (timing.stagger === 0 || count < 2) return 0;
	return index * Math.min(timing.stagger, MAX_STAGGER_TOTAL / (count - 1));
}
