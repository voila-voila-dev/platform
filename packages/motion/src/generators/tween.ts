import { easeOut, resolveEasing } from "#/easing/named.ts";
import type { EasingDefinition } from "#/easing/types.ts";
import type { Generator, GeneratorState } from "#/generators/types.ts";

export interface TweenOptions {
	readonly keyframes: readonly number[];
	/** Seconds, default 0.3. */
	readonly duration?: number;
	/** One easing for every segment, or one per segment. */
	readonly ease?: EasingDefinition | readonly EasingDefinition[];
	/** Each keyframe's offset in 0..1, default evenly spaced. */
	readonly times?: readonly number[];
	/** A tween's shape is fixed by its easing; accepted so options pass through unchanged. */
	readonly velocity?: number;
}

/** Window for the finite difference that reports velocity. */
const VELOCITY_WINDOW = 0.005;

function isEasingList(
	ease: TweenOptions["ease"],
): ease is readonly EasingDefinition[] {
	return Array.isArray(ease) && typeof ease[0] !== "number";
}

export function tween(options: TweenOptions): Generator {
	const { keyframes } = options;
	const duration = Math.max(0, options.duration ?? 0.3);
	const last = keyframes.length - 1;
	const times =
		options.times ??
		keyframes.map((_unused, index) => (last === 0 ? 0 : index / last));
	const eases = Array.from({ length: Math.max(last, 1) }, (_unused, index) => {
		const ease = options.ease;
		if (ease === undefined) {
			return easeOut;
		}
		return resolveEasing(
			isEasingList(ease)
				? (ease[index] ?? ease[ease.length - 1] ?? "easeOut")
				: ease,
		);
	});

	function valueAt(elapsed: number): number {
		const progress =
			duration === 0 ? 1 : Math.min(1, Math.max(0, elapsed / duration));
		let segment = 0;
		while (segment < last - 1 && progress > (times[segment + 1] ?? 1)) {
			segment += 1;
		}
		const start = times[segment] ?? 0;
		const end = times[segment + 1] ?? 1;
		const from = keyframes[segment] ?? 0;
		const to = keyframes[segment + 1] ?? from;
		const local = end === start ? 1 : (progress - start) / (end - start);
		const eased = (eases[segment] ?? easeOut)(Math.min(1, Math.max(0, local)));
		return from + (to - from) * eased;
	}

	return {
		duration,
		at(elapsed): GeneratorState {
			if (elapsed >= duration) {
				return { value: keyframes[last] ?? 0, velocity: 0, done: true };
			}
			const value = valueAt(elapsed);
			const before = Math.max(0, elapsed - VELOCITY_WINDOW);
			const after = before === elapsed ? elapsed + VELOCITY_WINDOW : elapsed;
			const velocity = (valueAt(after) - valueAt(before)) / (after - before);
			return { value, velocity, done: false };
		},
	};
}
