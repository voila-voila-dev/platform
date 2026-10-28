import { mix } from "#/interpolate/mix.ts";

/** Element by element; arrays of different lengths have no midpoint, so they step. */
export function mixArray<T>(
	from: readonly T[],
	to: readonly T[],
): ((progress: number) => T[]) | undefined {
	if (from.length !== to.length) {
		return undefined;
	}
	const mixers = from.map((value, index) => mix(value, to[index] as T));
	return (progress) => mixers.map((mixer) => mixer(progress));
}
