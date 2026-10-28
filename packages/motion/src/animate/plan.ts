import type { AnimationOptions } from "#/animate/types.ts";
import { spring } from "#/generators/spring.ts";
import { tween } from "#/generators/tween.ts";
import type { Generator } from "#/generators/types.ts";

const DEFAULT_TWEEN_DURATION = 0.3;

/**
 * The motion of one channel, as a generator. Two numbers spring in their own
 * units, so the velocity a value already has carries into the new motion.
 * Anything else (colours, paths, several keyframes) moves a position along
 * the keyframe list — 0 at the first, 1 at the second… — and the caller mixes
 * the keyframes at that position.
 */
export function planGenerator(
	keyframes: readonly unknown[],
	options: AnimationOptions,
	velocity = 0,
): { readonly generator: Generator; readonly positional: boolean } {
	const numeric = keyframes.every((frame) => typeof frame === "number");
	const springs =
		options.type !== "tween" && keyframes.length === 2 && !options.ease;
	if (numeric) {
		const values = keyframes as readonly number[];
		const generator = springs
			? spring({
					...options,
					from: values[0] ?? 0,
					to: values[1] ?? 0,
					velocity: options.velocity ?? velocity,
				})
			: tween({
					keyframes: values,
					duration: options.duration ?? DEFAULT_TWEEN_DURATION,
					ease: options.ease,
					times: options.times,
				});
		return { generator, positional: false };
	}
	const positions = keyframes.map((_frame, index) => index);
	const generator = springs
		? spring({ ...options, from: 0, to: 1 })
		: tween({
				keyframes: positions,
				duration: options.duration ?? DEFAULT_TWEEN_DURATION,
				ease: options.ease,
				times: options.times,
			});
	return { generator, positional: true };
}

/** The elapsed time within the current repetition, playing backwards on odd ones when they reverse. */
export function iterationTime(
	elapsed: number,
	duration: number,
	options: AnimationOptions,
): number {
	const repeat = options.repeat ?? 0;
	if (repeat === 0 || duration === 0) return Math.min(elapsed, duration);
	const total = duration * (repeat + 1);
	const clamped = Math.min(elapsed, total);
	const iteration = Math.min(Math.floor(clamped / duration), repeat);
	const within = clamped - iteration * duration;
	return options.repeatType === "reverse" && iteration % 2 === 1
		? duration - within
		: within;
}

export function totalDuration(
	duration: number,
	options: AnimationOptions,
): number {
	return duration * ((options.repeat ?? 0) + 1);
}
