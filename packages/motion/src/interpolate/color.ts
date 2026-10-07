import {
	oklabToRgba,
	parseColor,
	type Rgba,
} from "#/interpolate/color-parse.ts";
import { mixNumber } from "#/interpolate/number.ts";

export { parseColor, type Rgba } from "#/interpolate/color-parse.ts";

type Oklab = readonly [number, number, number, number];

const VARIABLE = /^var\(/i;
const IDENTIFIER = /^[a-z]+$/i;

function srgbToLinear(value: number): number {
	return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function toOklab({ r, g, b, alpha }: Rgba): Oklab {
	const [lr, lg, lb] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
	const l = Math.cbrt(
		0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
	);
	const m = Math.cbrt(
		0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
	);
	const s = Math.cbrt(
		0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
	);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
		alpha,
	];
}

function byte(value: number): number {
	return Math.round(Math.min(1, Math.max(0, value)) * 255);
}

function format({ r, g, b, alpha }: Rgba): string {
	const a = Math.round(Math.min(1, Math.max(0, alpha)) * 1000) / 1000;
	return `rgba(${byte(r)}, ${byte(g)}, ${byte(b)}, ${a})`;
}

/** A string the page resolves to a colour: written out, a `var()`, a name, `currentColor`. */
export function isColorLike(text: string): boolean {
	const trimmed = text.trim();
	return (
		parseColor(trimmed) !== undefined ||
		VARIABLE.test(trimmed) ||
		IDENTIFIER.test(trimmed)
	);
}

/**
 * Two written-out colours mix in oklab here, premultiplied so a fade from
 * `transparent` does not pass through grey. A `var()` or a name is only known
 * to the page, so it mixes there: `color-mix()` with the share quantised to
 * 2 %, which caps the strings a long animation mints at 51.
 */
export function mixColor(
	from: string,
	to: string,
): (progress: number) => string {
	const start = parseColor(from);
	const end = parseColor(to);
	if (start === undefined || end === undefined) {
		return (progress) => {
			const share = Math.round(progress * 50) * 2;
			if (share <= 0) {
				return from;
			}
			return share >= 100
				? to
				: `color-mix(in oklab, ${to} ${share}%, ${from})`;
		};
	}
	const a = toOklab(start);
	const b = toOklab(end);
	return (progress) => {
		if (progress === 0) {
			return from;
		}
		if (progress === 1) {
			return to;
		}
		const alpha = mixNumber(a[3], b[3], progress);
		function channel(index: 0 | 1 | 2) {
			return alpha === 0
				? 0
				: mixNumber(a[index] * a[3], b[index] * b[3], progress) / alpha;
		}
		return format(oklabToRgba([channel(0), channel(1), channel(2), alpha]));
	};
}
