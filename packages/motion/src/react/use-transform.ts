import * as React from "react";
import {
	type InterpolateOptions,
	interpolate,
} from "#/interpolate/interpolate.ts";
import { type MotionValue, motionValue } from "#/value/motion-value.ts";

/**
 * A motion value derived from others: mapped from an input range to an
 * output range, or computed by a function. It updates with its sources,
 * without re-rendering the component.
 */
export function useTransform<T>(
	source: MotionValue<number>,
	input: readonly number[],
	output: readonly T[],
	options?: InterpolateOptions<T>,
): MotionValue<T>;
export function useTransform<S, T>(
	source: MotionValue<S>,
	compute: (value: S) => T,
): MotionValue<T>;
export function useTransform<V extends readonly unknown[], T>(
	sources: { readonly [K in keyof V]: MotionValue<V[K]> },
	compute: (...values: V) => T,
): MotionValue<T>;
export function useTransform(...args: unknown[]): MotionValue<unknown> {
	const [source, second, output, options] = args;
	const sources = (
		Array.isArray(source) ? source : [source]
	) as MotionValue<unknown>[];
	// Ranges are usually inline arrays: rebuild the mapping when their contents change, not their identity.
	const ranges =
		typeof second === "function" ? "" : JSON.stringify([second, output]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the ranges' contents.
	const map = React.useMemo(
		() =>
			typeof second === "function"
				? undefined
				: interpolate(
						second as readonly number[],
						output as readonly unknown[],
						options as InterpolateOptions<unknown>,
					),
		[ranges],
	);
	const compute = (map ?? second) as (...values: unknown[]) => unknown;
	const latest = React.useRef(compute);
	latest.current = compute;
	function read(): unknown {
		return latest.current(...sources.map((one) => one.get()));
	}
	// biome-ignore lint/correctness/useExhaustiveDependencies: rebuilt only when a source changes.
	const derived = React.useMemo(() => motionValue(read()), sources);
	// Rendered with new ranges or a new function: the value follows at once.
	const computed = React.useRef(compute);
	if (computed.current !== compute) {
		computed.current = compute;
		derived.set(read());
	}
	// Subscribed in an effect, so StrictMode's unmount and remount leave it listening.
	// biome-ignore lint/correctness/useExhaustiveDependencies: the sources are the identity of `derived`.
	React.useEffect(() => {
		derived.set(read());
		const unsubscribes = sources.map((one) =>
			one.on("change", () => derived.set(read())),
		);
		return () => {
			for (const unsubscribe of unsubscribes) unsubscribe();
		};
	}, [derived]);
	return derived;
}
