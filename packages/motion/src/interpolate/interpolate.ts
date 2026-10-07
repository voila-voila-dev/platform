import { resolveEasing } from "#/easing/named.ts";
import type { EasingDefinition } from "#/easing/types.ts";
import { type Mixer, mix } from "#/interpolate/mix.ts";

export interface InterpolateOptions<T> {
	/** Hold the output at its ends outside the input range. Default true. */
	readonly clamp?: boolean;
	/** One easing for every segment, or one per segment. */
	readonly ease?: EasingDefinition | readonly EasingDefinition[];
	readonly mixer?: (from: T, to: T) => Mixer<T>;
}

/**
 * Maps a number through a piecewise range: `interpolate([0, 100], [1, 0])`
 * turns a scroll offset into an opacity, `[0, 50, 100]` with three colours a
 * progress into a gradient. The input may run either way.
 */
export function interpolate<T>(
	input: readonly number[],
	output: readonly T[],
	options: InterpolateOptions<T> = {},
): (value: number) => T {
	if (input.length !== output.length || input.length === 0) {
		throw new RangeError(
			"interpolate: input and output need the same, non-zero length",
		);
	}
	if (input.length === 1) {
		return () => output[0] as T;
	}
	const direction =
		(input[0] as number) > (input[input.length - 1] as number) ? -1 : 1;
	const makeMixer = options.mixer ?? mix;
	const mixers = output
		.slice(1)
		.map((value, index) => makeMixer(output[index] as T, value));
	const eases = mixers.map((_mixer, index) => {
		const ease = options.ease;
		const definition = Array.isArray(ease) ? ease[index] : ease;
		return resolveEasing((definition ?? "linear") as EasingDefinition);
	});
	const clamp = options.clamp ?? true;
	const low = Math.min(input[0] as number, input[input.length - 1] as number);
	const high = Math.max(input[0] as number, input[input.length - 1] as number);
	return (value) => {
		const at = clamp ? Math.min(high, Math.max(low, value)) : value;
		let segment = 0;
		while (
			segment < mixers.length - 1 &&
			(at - (input[segment + 1] as number)) * direction > 0
		) {
			segment += 1;
		}
		const start = input[segment] as number;
		const span = (input[segment + 1] as number) - start;
		const progress = span === 0 ? 1 : (at - start) / span;
		const eased = (eases[segment] as (progress: number) => number)(progress);
		return (mixers[segment] as Mixer<T>)(eased);
	};
}
