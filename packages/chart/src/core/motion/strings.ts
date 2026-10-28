import { tweenPath } from "#/core/motion/tween.ts";
import type { SceneNode } from "#/core/types.ts";

/** The channels that move as a string mixed by progress, not as a number. */
export const STRING_CHANNELS = ["d", "fill", "stroke"] as const;

export type StringChannel = (typeof STRING_CHANNELS)[number];

/** 2 % steps: at most 51 colours per pair, so the Canvas resolver's cache stays small. */
const COLOUR_STEPS = 50;

/**
 * A colour part of the way to another, as CSS: `color-mix()` reads the
 * chart's `var(--chart-1)` tokens as they are, so nothing parses colours,
 * and the Canvas resolver computes the mix against the page like any
 * other colour.
 */
export function colourBetween(
	from: string,
	to: string,
	progress: number,
): string {
	const step = Math.round(Math.min(1, Math.max(0, progress)) * COLOUR_STEPS);
	if (step === 0) return from;
	if (step === COLOUR_STEPS) return to;
	return `color-mix(in oklab, ${to} ${(step * 100) / COLOUR_STEPS}%, ${from})`;
}

/** What a string channel of `node` reads now. */
export function stringOf(
	node: SceneNode | undefined,
	channel: StringChannel,
): string | undefined {
	if (node === undefined || node.kind === "group") return undefined;
	return channel === "d"
		? node.kind === "path"
			? node.d
			: undefined
		: node.paint[channel];
}

/** The mix from what was painted to what `node` asks for. */
export function stringMixer(
	node: SceneNode,
	channel: StringChannel,
	from: string,
	to: string,
): (progress: number) => string {
	if (channel !== "d") {
		return (progress) => colourBetween(from, to, progress);
	}
	const morph = node.kind === "path" ? node.morph : undefined;
	return morph ? morph(from, to) : (progress) => tweenPath(from, to, progress);
}

/** `node` with one string channel set to its moving value. */
export function withString<Node extends Exclude<SceneNode, { kind: "group" }>>(
	node: Node,
	channel: StringChannel,
	value: string,
): Node {
	if (channel !== "d")
		return { ...node, paint: { ...node.paint, [channel]: value } };
	return node.kind === "path" ? { ...node, d: value } : node;
}
