import {
	type InterpolateOptions,
	interpolate,
} from "#/interpolate/interpolate.ts";
import { type MotionValue, motionValue } from "#/value/motion-value.ts";

type Values<V extends readonly unknown[]> = {
	readonly [K in keyof V]: MotionValue<V[K]>;
};

/**
 * A value derived from others, recomputed on each of their changes:
 * `transformValue(x, [0, 100], [1, 0])` maps through a range,
 * `transformValue([x, y], (x, y) => Math.hypot(x, y))` combines. Its
 * `destroy()` lets go of the sources.
 */
export function transformValue<T>(
	source: MotionValue<number>,
	input: readonly number[],
	output: readonly T[],
	options?: InterpolateOptions<T>,
): MotionValue<T>;
export function transformValue<S, T>(
	source: MotionValue<S>,
	compute: (value: S) => T,
): MotionValue<T>;
export function transformValue<V extends readonly unknown[], T>(
	sources: Values<V>,
	compute: (...values: V) => T,
): MotionValue<T>;
export function transformValue<T>(
	sources: MotionValue<unknown> | readonly MotionValue<unknown>[],
	inputOrCompute: readonly number[] | ((...values: never[]) => T),
	output?: readonly T[],
	options?: InterpolateOptions<T>,
): MotionValue<T> {
	const list: readonly MotionValue<unknown>[] = Array.isArray(sources)
		? sources
		: [sources as MotionValue<unknown>];
	const compute =
		typeof inputOrCompute === "function"
			? (inputOrCompute as (...values: unknown[]) => T)
			: mapThrough(interpolate(inputOrCompute, output ?? [], options));
	function read(): T {
		return compute(...list.map((source) => source.get()));
	}
	const derived = motionValue(read());
	const unsubscribes = list.map((source) =>
		source.on("change", () => derived.set(read())),
	);
	const destroy = derived.destroy;
	derived.destroy = () => {
		for (const unsubscribe of unsubscribes) unsubscribe();
		destroy();
	};
	return derived;
}

function mapThrough<T>(map: (value: number) => T): (...values: unknown[]) => T {
	return (value) => map(value as number);
}
