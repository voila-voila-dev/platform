import { mix } from "#/interpolate/mix.ts";

type Record_ = Readonly<Record<string, unknown>>;

/** Key by key over the target's keys; a key the start lacks starts at its target. */
export function mixObject<T extends Record_>(
	from: T,
	to: T,
): (progress: number) => T {
	const mixers = Object.keys(to).map(
		(key) => [key, mix(key in from ? from[key] : to[key], to[key])] as const,
	);
	return (progress) => {
		const result: Record<string, unknown> = {};
		for (const [key, mixer] of mixers) {
			result[key] = mixer(progress);
		}
		return result as T;
	};
}
