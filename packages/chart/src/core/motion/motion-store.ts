import type { Generator } from "@voila.dev/motion";
import { enterFrom, exitTo } from "#/core/motion/enter-exit.ts";
import {
	STRING_CHANNELS,
	type StringChannel,
	stringMixer,
	stringOf,
	withString,
} from "#/core/motion/strings.ts";
import { type ChartTiming, staggerDelay } from "#/core/motion/timing.ts";
import type {
	ChartScene,
	GeometryMotion,
	GeometryPlan,
	SceneNode,
} from "#/core/types.ts";

/**
 * Every moving number of a chart, as springs keyed by node and channel. A
 * new scene retargets them: each channel starts from where it is painted, at
 * the speed it has, so an update landing mid-flight bends the motion instead
 * of kinking it. Pure and clocked from outside (milliseconds), so the SVG and
 * Canvas renderers move identically and tests step it by hand. Hit-testing
 * and focus never read it: they read the scene it moves towards, which never
 * holds the marks collapsing or the guides fading on their way out.
 */
export interface MotionStore {
	retarget(scene: ChartScene, now: number): void;
	/** The first render: lines that `enter: "draw"` trace themselves in. False when none does. */
	introduce(now: number): boolean;
	/** Jumps to `scene`: a resize, or reduced motion. */
	snap(scene: ChartScene): void;
	frame(now: number): ChartScene;
	settled(now: number): boolean;
}

interface Motion {
	readonly generator: Generator;
	/** Milliseconds, the delay included. */
	readonly start: number;
	/** A path or a colour: the generator runs a progress from 0 to 1, and this reads it. */
	readonly mix?: (progress: number) => string;
}

/**
 * A node on its way out, drawn after its old sibling until its springs
 * settle: a data mark collapsing, or a guide fading where it stood.
 */
interface Leaving {
	readonly node: SceneNode;
	/** Its old previous sibling's key, else its group's `first` marker. */
	readonly after: string | undefined;
	readonly siblings: readonly SceneNode[];
}

type Numeric = Record<string, number>;

const FIELDS: Record<SceneNode["kind"], readonly string[]> = {
	rect: ["x", "y", "width", "height"],
	circle: ["cx", "cy", "r"],
	line: ["x1", "y1", "x2", "y2"],
	text: ["x", "y"],
	path: [],
	group: [],
};

const OPACITY = "opacity";
const DRAWN = "drawn";
const SEPARATOR = "\u0000";
/**
 * A tick label or a grid line vanishing at once reads as a glitch, so they
 * fade out. Data marks never linger: a bar the data no longer has would show
 * a value that isn't true.
 */
const GUIDE_ROLES = new Set(["grid", "axis"]);

/** Where the leaving first children of the group `parent` are drawn. */
function first(parent: string | null): string | undefined {
	return parent === null ? undefined : parent + SEPARATOR;
}

/** Visits every node with its list and the key it is drawn after when it leaves (see `Leaving`). */
function walk(
	nodes: readonly SceneNode[],
	visit: (
		node: SceneNode,
		siblings: readonly SceneNode[],
		after: string | undefined,
	) => void,
	parent: string | null = null,
) {
	let after = first(parent);
	for (const node of nodes) {
		visit(node, nodes, after);
		if (node.kind === "group") walk(node.children, visit, node.key);
		after = node.key;
	}
}

function index(nodes: readonly SceneNode[]) {
	const byKey = new Map<string, SceneNode>();
	const siblings = new Map<string, readonly SceneNode[]>();
	const afters = new Map<string, string | undefined>();
	walk(nodes, (node, list, after) => {
		byKey.set(node.key, node);
		siblings.set(node.key, list);
		afters.set(node.key, after);
	});
	return { byKey, siblings, afters };
}

function channelKey(node: string, channel: string): string {
	return `${node}${SEPARATOR}${channel}`;
}

function elapsed(motion: Motion, now: number): number {
	return Math.max(0, (now - motion.start) / 1000);
}

function sample(motion: Motion, now: number) {
	return motion.generator.at(elapsed(motion, now));
}

function done(motion: Motion, now: number): boolean {
	return elapsed(motion, now) >= motion.generator.duration;
}

function clamp(value: number): number {
	return Math.min(1, Math.max(0, value));
}

export function createMotionStore(
	initial: ChartScene,
	timing: ChartTiming,
): MotionStore {
	let target = initial;
	const channels = new Map<string, Motion>();
	const shapes = new Map<
		string,
		{ readonly plan: GeometryPlan; readonly motion: GeometryMotion }
	>();
	const leaving = new Map<string, Leaving>();

	function value(node: string, channel: string, fallback: number, now: number) {
		const motion = channels.get(channelKey(node, channel));
		return motion ? sample(motion, now).value : fallback;
	}

	/** Springs one channel from `from` to `to`, at the speed it already has. */
	function spring1(
		node: string,
		channel: string,
		from: number,
		to: number,
		start: number,
		now: number,
	) {
		const key = channelKey(node, channel);
		const running = channels.get(key);
		const velocity = running ? sample(running, now).velocity : 0;
		channels.delete(key);
		if (from === to && velocity === 0) return;
		channels.set(key, { generator: timing.motion(from, to, velocity), start });
	}

	/** Mixes one string channel from what is painted to what `to` asks for. */
	function mixString(
		from: SceneNode,
		to: SceneNode,
		channel: StringChannel,
		start: number,
	) {
		const key = channelKey(to.key, channel);
		channels.delete(key);
		const was = stringOf(from, channel);
		const goal = stringOf(to, channel);
		if (was === undefined || goal === undefined || was === goal) return;
		channels.set(key, {
			generator: timing.motion(0, 1, 0),
			start,
			mix: stringMixer(to, channel, was, goal),
		});
	}

	function drop(node: string) {
		for (const key of channels.keys()) {
			if (key.startsWith(node + SEPARATOR)) channels.delete(key);
		}
		shapes.delete(node);
		leaving.delete(node);
	}

	/** `from` is the node as painted now (or the shape it enters from), `to` where it goes. */
	function move(from: SceneNode, to: SceneNode, start: number, now: number) {
		const key = to.key;
		for (const field of FIELDS[to.kind]) {
			const was = (from as unknown as Numeric)[field] as number;
			spring1(
				key,
				field,
				was,
				(to as unknown as Numeric)[field] as number,
				start,
				now,
			);
		}
		mixString(from, to, "fill", start);
		mixString(from, to, "stroke", start);
		if (to.kind !== "path" || from.kind !== "path") return;
		const previous = shapes.get(key);
		shapes.delete(key);
		channels.delete(channelKey(key, "d"));
		const motion = to.motion;
		const plan =
			motion && from.geometry && to.geometry
				? motion.plan(from.geometry, to.geometry)
				: undefined;
		if (!plan) {
			// No meaning to move: the node's own morph, else the numbers of `d`.
			mixString(from, to, "d", start);
			return;
		}
		for (const channel of previous?.plan.targets.keys() ?? []) {
			if (!plan.targets.has(channel)) {
				channels.delete(channelKey(key, `g${channel}`));
			}
		}
		for (const [channel, goal] of plan.targets) {
			const was = plan.starts.get(channel) ?? goal;
			spring1(key, `g${channel}`, was, goal, start, now);
		}
		shapes.set(key, { plan, motion: motion as GeometryMotion });
	}

	function paintNode(node: SceneNode, now: number): SceneNode {
		if (node.kind === "group") {
			return { ...node, children: paintList(node.children, node.key, now) };
		}
		const key = node.key;
		const moved: Numeric = {};
		for (const field of FIELDS[node.kind]) {
			moved[field] = value(
				key,
				field,
				(node as unknown as Numeric)[field] as number,
				now,
			);
		}
		let next = { ...node, ...moved } as Exclude<SceneNode, { kind: "group" }>;
		const shape = shapes.get(key);
		if (next.kind === "path" && shape) {
			const geometry = shape.plan.build((channel) =>
				value(key, `g${channel}`, shape.plan.targets.get(channel) ?? 0, now),
			);
			next = { ...next, geometry, d: shape.motion.draw(geometry) };
		}
		for (const channel of STRING_CHANNELS) {
			const motion = channels.get(channelKey(key, channel));
			if (motion?.mix) {
				next = withString(next, channel, motion.mix(sample(motion, now).value));
			}
		}
		const opacity = value(key, OPACITY, 1, now);
		const drawn = value(key, DRAWN, 1, now);
		if (opacity === 1 && drawn === 1) return next;
		return {
			...next,
			paint: {
				...next.paint,
				opacity: (next.paint.opacity ?? 1) * clamp(opacity),
				...(drawn < 1 &&
					next.kind === "path" &&
					next.geometry && {
						drawn: {
							fraction: clamp(drawn),
							length: next.motion?.length?.(next.geometry) ?? 0,
						},
					}),
			},
		} as SceneNode;
	}

	/** The painted list, with the nodes still leaving after the sibling they followed. */
	function paintList(
		list: readonly SceneNode[],
		parent: string | null,
		now: number,
	): SceneNode[] {
		const out: SceneNode[] = [];
		function place(after: string | undefined) {
			for (const [key, exit] of leaving) {
				if (exit.after !== after) continue;
				out.push(paintNode(exit.node, now));
				place(key);
			}
		}
		place(first(parent));
		for (const node of list) {
			out.push(paintNode(node, now));
			place(node.key);
		}
		return out;
	}

	function prune(now: number) {
		for (const [key, motion] of channels) {
			if (done(motion, now)) channels.delete(key);
		}
		const moving = new Set(
			[...channels.keys()].map((key) => key.split(SEPARATOR)[0]),
		);
		for (const byNode of [shapes, leaving]) {
			for (const key of byNode.keys()) {
				if (!moving.has(key)) byNode.delete(key);
			}
		}
	}

	return {
		retarget(scene, now) {
			const before = index(target.nodes);
			const after = index(scene.nodes);
			function painted(key: string): SceneNode | undefined {
				const node = before.byKey.get(key) ?? leaving.get(key)?.node;
				return node && paintNode(node, now);
			}
			for (const key of new Set([...before.byKey.keys(), ...leaving.keys()])) {
				if (after.byKey.has(key)) continue;
				const base = (before.byKey.get(key) ??
					leaving.get(key)?.node) as SceneNode;
				const exit = leaving.get(key);
				const siblings = exit?.siblings ?? before.siblings.get(key) ?? [];
				// A whole guide group leaving goes at once, its lines with it.
				const guide = base.kind !== "group" && GUIDE_ROLES.has(base.role ?? "");
				const goal = exitTo(base, siblings, after.byKey) ?? (guide && base);
				const from = painted(key);
				if (!goal || !from) {
					drop(key);
					continue;
				}
				move(from, goal, now, now);
				if (guide) {
					spring1(key, OPACITY, value(key, OPACITY, 1, now), 0, now, now);
				}
				leaving.set(key, {
					node: goal,
					after: exit ? exit.after : before.afters.get(key),
					siblings,
				});
			}
			const marks = [...after.byKey.values()].filter(
				(node) => node.role === "mark",
			);
			const order = new Map(marks.map((node, at) => [node.key, at]));
			for (const node of after.byKey.values()) {
				if (node.kind === "group") continue;
				const start =
					now +
					staggerDelay(timing, order.get(node.key) ?? 0, marks.length) * 1000;
				const old = painted(node.key);
				const returning = leaving.delete(node.key);
				const from =
					old ??
					enterFrom(node, after.siblings.get(node.key) ?? [], before.byKey);
				if (from) move(from, node, start, now);
				const fading = channels.get(channelKey(node.key, OPACITY));
				if ((!from && node.enter !== "none") || fading) {
					const shown = fading ? Math.max(0, sample(fading, now).value) : 0;
					// A guide coming back starts from rest: its fade-out speed points the wrong way.
					if (returning) channels.delete(channelKey(node.key, OPACITY));
					spring1(node.key, OPACITY, shown, 1, start, now);
				}
			}
			target = scene;
		},
		introduce(now) {
			let any = false;
			walk(target.nodes, (node) => {
				if (node.kind !== "path" || node.enter !== "draw") return;
				if (node.geometry?.kind !== "points" || node.paint.strokeDasharray) {
					return;
				}
				spring1(node.key, DRAWN, 0, 1, now, now);
				any = true;
			});
			return any;
		},
		snap(scene) {
			for (const motions of [channels, shapes, leaving]) {
				motions.clear();
			}
			target = scene;
		},
		frame(now) {
			prune(now);
			if (channels.size === 0) return target;
			return { ...target, nodes: paintList(target.nodes, null, now) };
		},
		settled(now) {
			return [...channels.values()].every((motion) => done(motion, now));
		},
	};
}
