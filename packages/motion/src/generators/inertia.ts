import { spring } from "#/generators/spring.ts";
import type { Generator, GeneratorState } from "#/generators/types.ts";

export interface InertiaOptions {
	readonly from: number;
	/** Units per second, typically a gesture's release velocity. */
	readonly velocity: number;
	/** How far the throw carries: target = from + power × velocity. */
	readonly power?: number;
	/** Seconds; higher glides longer. */
	readonly timeConstant?: number;
	readonly min?: number;
	readonly max?: number;
	readonly bounceStiffness?: number;
	readonly bounceDamping?: number;
	readonly restDelta?: number;
	/** Snap the natural resting point, e.g. to a grid. */
	readonly modifyTarget?: (target: number) => number;
}

/** The bound the value is past or heading past, if any. */
function boundBeyond(value: number, min?: number, max?: number) {
	if (min !== undefined && value < min) {
		return min;
	}
	if (max !== undefined && value > max) {
		return max;
	}
	return undefined;
}

/** A throw decaying exponentially, handing over to a spring when it hits `min` or `max`. */
export function inertia(options: InertiaOptions): Generator {
	const { from, velocity, min, max } = options;
	const timeConstant = options.timeConstant ?? 0.325;
	const restDelta = options.restDelta ?? 0.5;
	function bounce(start: number, startVelocity: number, bound: number) {
		return spring({
			from: start,
			to: bound,
			velocity: startVelocity,
			stiffness: options.bounceStiffness ?? 500,
			damping: options.bounceDamping ?? 10,
			restDelta,
		});
	}

	const outside = boundBeyond(from, min, max);
	if (outside !== undefined) {
		return bounce(from, velocity, outside);
	}

	const ideal = from + (options.power ?? 0.8) * velocity;
	const target = options.modifyTarget?.(ideal) ?? ideal;
	const amplitude = target - from;
	function decay(t: number): GeneratorState {
		const remaining = amplitude * Math.exp(-t / timeConstant);
		return {
			value: target - remaining,
			velocity: remaining / timeConstant,
			done: false,
		};
	}
	const settle =
		Math.abs(amplitude) > restDelta
			? timeConstant * Math.log(Math.abs(amplitude) / restDelta)
			: 0;

	const bound = boundBeyond(target, min, max);
	if (bound === undefined) {
		return {
			duration: settle,
			at: (elapsed) =>
				elapsed >= settle
					? { value: target, velocity: 0, done: true }
					: decay(Math.max(0, elapsed)),
		};
	}

	const hit = -timeConstant * Math.log((target - bound) / amplitude);
	const atHit = decay(hit);
	const handover = bounce(bound, atHit.velocity, bound);
	return {
		duration: hit + handover.duration,
		at: (elapsed) =>
			elapsed < hit ? decay(Math.max(0, elapsed)) : handover.at(elapsed - hit),
	};
}
