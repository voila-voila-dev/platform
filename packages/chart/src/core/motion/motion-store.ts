import { type Generator, spring, tween } from "@voila.dev/motion";
import { type ChartTiming, staggerDelay } from "#/core/motion/timing.ts";
import { tweenPath } from "#/core/motion/tween.ts";
import type { ChartScene, SceneNode } from "#/core/types.ts";

/**
 * Every moving number of a chart, as springs keyed by node and channel. A
 * new scene retargets them: each channel starts from where it is painted, at
 * the speed it has, so an update landing mid-flight bends the motion instead
 * of kinking it. Pure and clocked from outside (milliseconds), so the SVG and
 * Canvas renderers move identically and tests step it by hand. Hit-testing
 * and focus never read it: they read the scene it moves towards.
 */
export interface MotionStore {
	retarget(scene: ChartScene, now: number): void;
	/** Jumps to `scene`: a resize, or reduced motion. */
	snap(scene: ChartScene): void;
	frame(now: number): ChartScene;
	settled(now: number): boolean;
}

interface Motion {
	readonly generator: Generator;
	/** Milliseconds, the delay included. */
	readonly start: number;
}

interface PathMotion extends Motion {
	readonly from: string;
	readonly to: string;
}

type Numeric = Record<string, number>;

const CHANNELS: Record<SceneNode["kind"], readonly string[]> = {
	rect: ["x", "y", "width", "height"],
	circle: ["cx", "cy", "r"],
	line: ["x1", "y1", "x2", "y2"],
	text: ["x", "y"],
	path: [],
	group: [],
};

const OPACITY = "opacity";

function flatten(
	nodes: readonly SceneNode[],
	into = new Map<string, SceneNode>(),
) {
	for (const node of nodes) {
		into.set(node.key, node);
		if (node.kind === "group") flatten(node.children, into);
	}
	return into;
}

function channelKey(node: string, channel: string): string {
	return `${node}\u0000${channel}`;
}

function elapsed(motion: Motion, now: number): number {
	return Math.max(0, (now - motion.start) / 1000);
}

function done(motion: Motion, now: number): boolean {
	return elapsed(motion, now) >= motion.generator.duration;
}

export function createMotionStore(
	initial: ChartScene,
	timing: ChartTiming,
): MotionStore {
	let target = initial;
	const numbers = new Map<string, Motion>();
	const paths = new Map<string, PathMotion>();

	function generator(from: number, to: number, velocity: number): Generator {
		return timing.type === "spring"
			? spring({
					from,
					to,
					velocity,
					duration: timing.duration,
					bounce: timing.bounce,
				})
			: tween({
					keyframes: [from, to],
					duration: timing.duration,
					ease: timing.easing,
				});
	}

	function pathNow(key: string, fallback: string | undefined, now: number) {
		const motion = paths.get(key);
		if (!motion) return fallback;
		return tweenPath(
			motion.from,
			motion.to,
			motion.generator.at(elapsed(motion, now)).value,
		);
	}

	function moveNode(
		node: SceneNode,
		before: SceneNode | undefined,
		start: number,
		now: number,
	) {
		for (const channel of CHANNELS[node.kind]) {
			const key = channelKey(node.key, channel);
			const running = numbers.get(key);
			const state = running?.generator.at(elapsed(running, now));
			const from =
				state?.value ?? (before as unknown as Numeric | undefined)?.[channel];
			const to = (node as unknown as Numeric)[channel] as number;
			numbers.delete(key);
			if (from === undefined || (from === to && !state?.velocity)) continue;
			numbers.set(key, {
				generator: generator(from, to, state?.velocity ?? 0),
				start,
			});
		}
		if (node.kind === "path") {
			const from = pathNow(
				node.key,
				before?.kind === "path" ? before.d : undefined,
				now,
			);
			paths.delete(node.key);
			if (from !== undefined && from !== node.d) {
				paths.set(node.key, {
					generator: generator(0, 1, 0),
					start,
					from,
					to: node.d,
				});
			}
		}
		const fading = channelKey(node.key, OPACITY);
		const fade = numbers.get(fading);
		if (before === undefined || fade) {
			const from = fade ? fade.generator.at(elapsed(fade, now)).value : 0;
			numbers.set(fading, { generator: generator(from, 1, 0), start });
		}
	}

	function paint(node: SceneNode, now: number): SceneNode {
		if (node.kind === "group") {
			return {
				...node,
				children: node.children.map((child) => paint(child, now)),
			};
		}
		const moved: Numeric = {};
		for (const channel of [...CHANNELS[node.kind], OPACITY]) {
			const motion = numbers.get(channelKey(node.key, channel));
			if (!motion) continue;
			moved[channel] = motion.generator.at(elapsed(motion, now)).value;
		}
		const d = node.kind === "path" ? pathNow(node.key, node.d, now) : undefined;
		const { [OPACITY]: opacity, ...geometry } = moved;
		const next = {
			...node,
			...geometry,
			...(d === undefined ? {} : { d }),
		} as SceneNode;
		if (opacity === undefined) return next;
		const shown = Math.min(1, Math.max(0, opacity));
		const painted = next as Exclude<SceneNode, { kind: "group" }>;
		return {
			...painted,
			paint: {
				...painted.paint,
				opacity: (painted.paint.opacity ?? 1) * shown,
			},
		} as SceneNode;
	}

	return {
		retarget(scene, now) {
			const before = flatten(target.nodes);
			const after = flatten(scene.nodes);
			const marks = [...after.values()].filter((node) => node.role === "mark");
			const order = new Map(marks.map((node, index) => [node.key, index]));
			for (const key of before.keys()) {
				if (after.has(key)) continue;
				paths.delete(key);
				for (const channel of [
					...(CHANNELS[before.get(key)?.kind ?? "group"] ?? []),
					OPACITY,
				]) {
					numbers.delete(channelKey(key, channel));
				}
			}
			for (const node of after.values()) {
				const delay = staggerDelay(
					timing,
					order.get(node.key) ?? 0,
					marks.length,
				);
				moveNode(node, before.get(node.key), now + delay * 1000, now);
			}
			target = scene;
		},
		snap(scene) {
			numbers.clear();
			paths.clear();
			target = scene;
		},
		frame(now) {
			for (const [key, motion] of numbers) {
				if (done(motion, now)) numbers.delete(key);
			}
			for (const [key, motion] of paths) {
				if (done(motion, now)) paths.delete(key);
			}
			if (numbers.size === 0 && paths.size === 0) return target;
			return { ...target, nodes: target.nodes.map((node) => paint(node, now)) };
		},
		settled(now) {
			return [...numbers.values(), ...paths.values()].every((motion) =>
				done(motion, now),
			);
		},
	};
}
