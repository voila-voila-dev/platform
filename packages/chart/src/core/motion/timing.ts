import type { EasingName } from "@voila.dev/motion";

/** How a data update moves: what `<Chart animate>` accepts beyond `true`, `false` and a duration. */
export type ChartAnimation =
	| {
			readonly type?: "spring";
			/** Perceived duration, in milliseconds. */
			readonly duration?: number;
			/** 0 never overshoots (the default: a bar past its value shows a number the data doesn't have); up to 0.5. */
			readonly bounce?: number;
			/** Milliseconds between marks in focus order, capped at 300 ms in all. */
			readonly stagger?: number;
	  }
	| {
			readonly type: "tween";
			readonly duration?: number;
			readonly easing?: EasingName;
			readonly stagger?: number;
	  };

export interface ChartTiming {
	readonly type: "spring" | "tween";
	/** Seconds, as the motion package counts them. */
	readonly duration: number;
	readonly bounce: number;
	readonly easing: EasingName;
	/** Seconds between neighbours. */
	readonly stagger: number;
}

const DEFAULT_DURATION = 300;
const MAX_STAGGER_TOTAL = 0.3;

/** The timing an `animate` prop means, or `null` to snap. */
export function chartTiming(
	animate: boolean | number | ChartAnimation,
): ChartTiming | null {
	if (animate === false || animate === 0) return null;
	const options: ChartAnimation =
		typeof animate === "object"
			? animate
			: { duration: animate === true ? DEFAULT_DURATION : animate };
	return {
		type: options.type ?? "spring",
		duration: (options.duration ?? DEFAULT_DURATION) / 1000,
		bounce: Math.min(
			Math.max("bounce" in options ? (options.bounce ?? 0) : 0, 0),
			0.5,
		),
		easing: ("easing" in options ? options.easing : undefined) ?? "easeOut",
		stagger: (options.stagger ?? 0) / 1000,
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
