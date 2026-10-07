/** A colour in sRGB, every channel 0–1. */
export interface Rgba {
	readonly r: number;
	readonly g: number;
	readonly b: number;
	readonly alpha: number;
}

type Channels = readonly [number, number, number, number];
type Parser = (args: readonly string[]) => Rgba | undefined;

const FUNCTION = /^(rgba?|hsla?|oklch|oklab)\(\s*([^()]*)\)$/i;
const HUE_UNITS: Readonly<Record<string, number>> = {
	deg: 1,
	grad: 0.9,
	rad: 180 / Math.PI,
	turn: 360,
};

/** A number, a percentage of `percentScale`, or `none`. */
function channel(text: string | undefined, percentScale: number): number {
	if (text === undefined || text === "none") {
		return 0;
	}
	return text.endsWith("%")
		? (Number.parseFloat(text) / 100) * percentScale
		: Number.parseFloat(text);
}

function hue(text: string | undefined): number {
	const unit = text?.match(/[a-z]+$/i)?.[0].toLowerCase() ?? "deg";
	return channel(text, 1) * (HUE_UNITS[unit] ?? 1);
}

function alphaOf(args: readonly string[]): number {
	return args[3] === undefined ? 1 : channel(args[3], 1);
}

function linearToSrgb(value: number): number {
	return value <= 0.0031308
		? 12.92 * value
		: 1.055 * value ** (1 / 2.4) - 0.055;
}

/** Oklab is mixed in, and also a syntax a page can write colours in. */
export function oklabToRgba([l, a, b, alpha]: Channels): Rgba {
	const lms = [
		(l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
		(l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
		(l - 0.0894841775 * a - 1.291485548 * b) ** 3,
	] as const;
	const [x, y, z] = lms;
	return {
		r: linearToSrgb(4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z),
		g: linearToSrgb(-1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z),
		b: linearToSrgb(-0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z),
		alpha,
	};
}

function hslToRgba(h: number, s: number, l: number, alpha: number): Rgba {
	const amount = s * Math.min(l, 1 - l);
	function f(n: number) {
		const k = (n + h / 30) % 12;
		return l - amount * Math.max(-1, Math.min(k - 3, 9 - k, 1));
	}
	return { r: f(0), g: f(8), b: f(4), alpha };
}

const PARSERS: Readonly<Record<string, Parser>> = {
	rgb: (args) => ({
		r: channel(args[0], 255) / 255,
		g: channel(args[1], 255) / 255,
		b: channel(args[2], 255) / 255,
		alpha: alphaOf(args),
	}),
	hsl: (args) =>
		hslToRgba(
			((hue(args[0]) % 360) + 360) % 360,
			channel(args[1], 100) / 100,
			channel(args[2], 100) / 100,
			alphaOf(args),
		),
	oklab: (args) =>
		oklabToRgba([
			channel(args[0], 1),
			channel(args[1], 0.4),
			channel(args[2], 0.4),
			alphaOf(args),
		]),
	oklch: (args) => {
		const chroma = channel(args[1], 0.4);
		const angle = (hue(args[2]) * Math.PI) / 180;
		return oklabToRgba([
			channel(args[0], 1),
			chroma * Math.cos(angle),
			chroma * Math.sin(angle),
			alphaOf(args),
		]);
	},
};

function parseHex(hex: string): Rgba | undefined {
	const digits =
		hex.length <= 4 ? [...hex].map((digit) => digit + digit).join("") : hex;
	if (!/^[0-9a-f]{6}(?:[0-9a-f]{2})?$/i.test(digits)) {
		return undefined;
	}
	function byte(index: number) {
		return Number.parseInt(digits.slice(index, index + 2), 16) / 255;
	}
	return {
		r: byte(0),
		g: byte(2),
		b: byte(4),
		alpha: digits.length === 8 ? byte(6) : 1,
	};
}

/** A colour written out in full; `undefined` for what only the page can resolve (`var()`, names). */
export function parseColor(text: string): Rgba | undefined {
	const trimmed = text.trim();
	if (trimmed.toLowerCase() === "transparent") {
		return { r: 0, g: 0, b: 0, alpha: 0 };
	}
	if (trimmed.startsWith("#")) {
		return parseHex(trimmed.slice(1));
	}
	const match = FUNCTION.exec(trimmed);
	if (match === null) {
		return undefined;
	}
	const name = (match[1] as string).toLowerCase().replace(/a$/, "");
	const args = (match[2] as string).split(/[\s,/]+/).filter(Boolean);
	return PARSERS[name]?.(args);
}
