import { groupControls, thenable } from "#/animate/controls.ts";
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
	const busy = new Map<object, Map<string, Promise<void>>>();
	const children: AnimationControls[] = [];
	const waits: Promise<void>[] = [];
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
		const start = startOf(own.at, cursor, previousStart, labels);
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
		const launch = () =>
			animateOne(target, keyframes, optionsAt((now() - begun) / 1000));
		let finished: Promise<void>;
		if (before.length === 0) {
			const controls = launch();
			children.push(controls);
			finished = controls.finished;
			cursor = Math.max(start, controls.duration);
		} else {
			finished = Promise.all(before).then(() => launch().finished);
			waits.push(finished);
		}
		for (const one of targets) {
			const byKey = busy.get(one) ?? new Map();
			busy.set(one, byKey);
			for (const key of keys) byKey.set(key, finished);
		}
		previousStart = start;
	}
	const group = groupControls(children);
	const finished = Promise.all([group.finished, ...waits]).then(
		() => undefined,
	);
	return Object.assign(group, thenable(finished));
}
