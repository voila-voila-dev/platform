import { groupControls, thenable } from "#/animate/controls.ts";
import { planGenerator, totalDuration } from "#/animate/plan.ts";
import type {
	AnimationControls,
	AnimationOptions,
	DOMKeyframes,
	ElementTarget,
	Keyframes,
} from "#/animate/types.ts";
import { now } from "#/frame/frame.ts";
import type { MotionValue } from "#/value/motion-value.ts";

/**
 * When a segment starts: seconds from the start of the sequence, `"+0.1"` or
 * `"-0.2"` from the end of the segment before, `"<"` with the segment before,
 * or the name of a label.
 */
export type SequenceAt = number | `+${number}` | `-${number}` | "<" | string;

export interface SegmentOptions extends AnimationOptions {
	readonly at?: SequenceAt;
}

export type Segment =
	| readonly [ElementTarget, DOMKeyframes, SegmentOptions?]
	// biome-ignore lint/suspicious/noExplicitAny: a sequence mixes values of any type.
	| readonly [MotionValue<any>, Keyframes<any>, SegmentOptions?]
	| string
	| { readonly name: string; readonly at?: SequenceAt };

export type AnimateOne = (
	target: unknown,
	keyframes: unknown,
	options: AnimationOptions,
) => AnimationControls;

export type ResolveTargets = (target: unknown) => readonly object[];

function startOf(
	at: SequenceAt | undefined,
	cursor: number,
	previousStart: number,
	labels: ReadonlyMap<string, number>,
): number {
	if (at === undefined) return cursor;
	if (typeof at === "number") return at;
	if (at === "<") return previousStart;
	if (/^[+-]/.test(at)) return Math.max(0, cursor + Number(at));
	return labels.get(at) ?? cursor;
}

/**
 * How long a segment that waits for an earlier one will run once launched.
 * Its first keyframe is only read then, but a tween's length doesn't depend
 * on it, and neither does a default spring's (its rest thresholds scale with
 * the distance).
 */
function plannedDuration(keyframes: unknown, options: AnimationOptions) {
	const channels =
		typeof keyframes === "object" &&
		keyframes !== null &&
		!Array.isArray(keyframes)
			? Object.values(keyframes)
			: [keyframes];
	const { delay } = options;
	return (
		(typeof delay === "number" ? delay : 0) +
		Math.max(
			0,
			...channels.map((channel) => {
				const frames = Array.isArray(channel) ? channel : [0, channel];
				const { generator } = planGenerator(
					frames.map((_frame, index) => index),
					options,
				);
				return totalDuration(generator.duration, options);
			}),
		)
	);
}

/**
 * Launches every segment at once, each delayed to its place on the
 * timeline, so the whole sequence shares one clock and can be scrubbed. A
 * segment that animates a property an earlier segment already animates
 * waits for that one to finish, then starts from where it left off.
 */
export function animateSequence(
	segments: readonly Segment[],
	options: AnimationOptions,
	animateOne: AnimateOne,
	resolveTargets: ResolveTargets,
): AnimationControls {
	const begun = now();
	const labels = new Map<string, number>();
	const busy = new Map<
		object,
		Map<string, { readonly finished: Promise<void>; readonly end: number }>
	>();
	const children: AnimationControls[] = [];
	const waits: Promise<void>[] = [];
	let end = 0;
	let cursor = 0;
	let previousStart = 0;
	for (const segment of segments) {
		if (typeof segment === "string" || "name" in segment) {
			const label = typeof segment === "string" ? { name: segment } : segment;
			labels.set(label.name, startOf(label.at, cursor, previousStart, labels));
			continue;
		}
		const [target, keyframes, own = {}] = segment as readonly [
			unknown,
			unknown,
			SegmentOptions?,
		];
		const placed = startOf(own.at, cursor, previousStart, labels);
		const keys =
			typeof keyframes === "object" &&
			keyframes !== null &&
			!Array.isArray(keyframes)
				? Object.keys(keyframes)
				: ["value"];
		const targets = resolveTargets(target);
		const before = targets.flatMap((one) =>
			keys.flatMap((key) => busy.get(one)?.get(key) ?? []),
		);
		const start = Math.max(placed, ...before.map((earlier) => earlier.end));
		const { delay } = own;
		/** Launched late, a segment only waits for what is left of its delay. */
		function optionsAt(elapsed: number): AnimationOptions {
			const offset = start - elapsed;
			return {
				...options,
				...own,
				delay:
					typeof delay === "function"
						? (index, total) => Math.max(0, offset + delay(index, total))
						: Math.max(0, offset + (delay ?? 0)),
			};
		}
		const launch = () =>
			animateOne(target, keyframes, optionsAt((now() - begun) / 1000));
		let finished: Promise<void>;
		let ends: number;
		if (before.length === 0) {
			const controls = launch();
			children.push(controls);
			finished = controls.finished;
			ends = Math.max(start, controls.duration);
		} else {
			finished = Promise.all(before.map((earlier) => earlier.finished)).then(
				() => launch().finished,
			);
			waits.push(finished);
			ends = start + plannedDuration(keyframes, { ...options, ...own });
		}
		cursor = ends;
		end = Math.max(end, ends);
		for (const one of targets) {
			const byKey = busy.get(one) ?? new Map();
			busy.set(one, byKey);
			for (const key of keys) byKey.set(key, { finished, end: ends });
		}
		previousStart = start;
	}
	const group = groupControls(children);
	const finished = Promise.all([group.finished, ...waits]).then(
		() => undefined,
	);
	// The segments still waiting count too: they end after the ones launched.
	Object.defineProperty(group, "duration", {
		value: Math.max(end, group.duration),
	});
	return Object.assign(group, thenable(finished));
}
