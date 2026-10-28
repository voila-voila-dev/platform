import { mixArray } from "#/interpolate/array.ts";
import { isColorLike, mixColor, parseColor } from "#/interpolate/color.ts";
import { mixComplex } from "#/interpolate/complex.ts";
import { mixNumber } from "#/interpolate/number.ts";
import { mixObject } from "#/interpolate/object.ts";
import { mixPath } from "#/interpolate/path/morph.ts";

export type Mixer<T> = (progress: number) => T;

type Strategy = (from: unknown, to: unknown) => Mixer<unknown> | undefined;

const PATH = /^\s*[Mm]/;

function bothStrings(from: unknown, to: unknown): [string, string] | undefined {
	return typeof from === "string" && typeof to === "string"
		? [from, to]
		: undefined;
}

/**
 * A colour pair needs one side spelled out (a name counts where a browser can
 * spell it), or both to be variables: two other bare words are as likely
 * `auto` and `none` as colours.
 */
function colors(from: string, to: string): boolean {
	const resolved =
		parseColor(from) !== undefined || parseColor(to) !== undefined;
	const variables = /^\s*var\(/i.test(from) && /^\s*var\(/i.test(to);
	return isColorLike(from) && isColorLike(to) && (resolved || variables);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Tried in order; the first that knows the pair mixes it. */
const STRATEGIES: readonly Strategy[] = [
	(from, to) =>
		typeof from === "number" && typeof to === "number"
			? (progress) => mixNumber(from, to, progress)
			: undefined,
	(from, to) => {
		const pair = bothStrings(from, to);
		return pair && PATH.test(pair[0]) && PATH.test(pair[1])
			? mixPath(...pair)
			: undefined;
	},
	(from, to) => {
		const pair = bothStrings(from, to);
		return pair && colors(...pair) ? mixColor(...pair) : undefined;
	},
	(from, to) => {
		const pair = bothStrings(from, to);
		return pair && mixComplex(...pair);
	},
	(from, to) =>
		Array.isArray(from) && Array.isArray(to) ? mixArray(from, to) : undefined,
	(from, to) =>
		isRecord(from) && isRecord(to) ? mixObject(from, to) : undefined,
];

/**
 * The value `progress` of the way from `from` to `to`, whatever they are:
 * numbers, colours (in oklab), paths (morphed), strings of numbers, arrays,
 * objects. What has no midpoint switches halfway.
 */
export function mix<T>(from: T, to: T): Mixer<T> {
	for (const strategy of STRATEGIES) {
		const mixer = strategy(from, to);
		if (mixer !== undefined) {
			return mixer as Mixer<T>;
		}
	}
	return (progress) => (progress < 0.5 ? from : to);
}
