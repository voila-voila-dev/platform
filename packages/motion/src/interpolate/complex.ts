import { mixColor } from "#/interpolate/color.ts";
import { mixNumber } from "#/interpolate/number.ts";

type Token =
	| { readonly kind: "number"; readonly value: number }
	| { readonly kind: "color"; readonly value: string };

interface Parsed {
	readonly skeleton: readonly string[];
	readonly tokens: readonly Token[];
}

/** Colours first, so a hex or an `rgb()` is one token rather than its digits. */
const TOKEN =
	/(#[0-9a-f]{3,8}\b|(?:rgba?|hsla?|oklch|oklab)\([^()]*\))|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/gi;

function parse(text: string): Parsed {
	const skeleton: string[] = [];
	const tokens: Token[] = [];
	let last = 0;
	for (const match of text.matchAll(TOKEN)) {
		skeleton.push(text.slice(last, match.index));
		tokens.push(
			match[1] === undefined
				? { kind: "number", value: Number(match[2]) }
				: { kind: "color", value: match[1] },
		);
		last = match.index + match[0].length;
	}
	skeleton.push(text.slice(last));
	return { skeleton, tokens };
}

function round(value: number): number {
	return Math.round(value * 1000) / 1000;
}

/**
 * Strings that differ only in their numbers and colours: `10px 20px`, a
 * transform list, two paths with the same commands. Anything else has no
 * midpoint here, and `undefined` says so.
 */
export function mixComplex(
	from: string,
	to: string,
): ((progress: number) => string) | undefined {
	const start = parse(from);
	const end = parse(to);
	const sameShape =
		start.tokens.length === end.tokens.length &&
		start.skeleton.every((part, index) => part === end.skeleton[index]) &&
		start.tokens.every(
			(token, index) => token.kind === end.tokens[index]?.kind,
		);
	if (!sameShape || (start.tokens.length === 0 && from !== to)) {
		return undefined;
	}
	const mixers = start.tokens.map((token, index) => {
		const target = end.tokens[index] as Token;
		if (token.kind === "color") {
			return mixColor(token.value, target.value as string);
		}
		const a = token.value;
		const b = target.value as number;
		return (progress: number) => String(round(mixNumber(a, b, progress)));
	});
	return (progress) => {
		if (progress === 0) {
			return from;
		}
		if (progress === 1) {
			return to;
		}
		let text = start.skeleton[0] as string;
		mixers.forEach((mixer, index) => {
			text += mixer(progress) + (start.skeleton[index + 1] as string);
		});
		return text;
	};
}
