import type { ChartPaint, ChartScene, SceneNode } from "#/core/types.ts";

/**
 * A scene part of the way from one scene to the next, keyed by node: what an
 * animated update draws on each frame. It lives in the core so the SVG and
 * Canvas renderers animate identically, and never feeds hit-testing or
 * focus: those always read the scene being animated towards.
 *
 * A node present on both sides moves; a new one fades in; one that left is
 * gone at once (fading out a bar the data no longer has would show a value
 * that is not true any more). A path tweens point by point when both shapes
 * share their commands, and swaps at the end when they do not.
 */

const NUMBER = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;

function mix(from: number, to: number, t: number): number {
	return from + (to - from) * t;
}

/** Two paths can tween when only their numbers differ. */
export function tweenPath(from: string, to: string, t: number): string {
	const fromNumbers = from.match(NUMBER);
	const toNumbers = to.match(NUMBER);
	if (
		fromNumbers === null ||
		toNumbers === null ||
		fromNumbers.length !== toNumbers.length ||
		from.replace(NUMBER, "#") !== to.replace(NUMBER, "#")
	) {
		return t < 1 ? from : to;
	}
	let index = 0;
	return to.replace(NUMBER, () => {
		const value = mix(Number(fromNumbers[index]), Number(toNumbers[index]), t);
		index += 1;
		return String(Math.round(value * 100) / 100);
	});
}

function fadeIn<TPaint extends ChartPaint>(paint: TPaint, t: number): TPaint {
	return { ...paint, opacity: (paint.opacity ?? 1) * t };
}

function tweenNode(
	from: SceneNode | undefined,
	to: SceneNode,
	t: number,
): SceneNode {
	if (from === undefined || from.kind !== to.kind) {
		return to.kind === "group"
			? {
					...to,
					children: to.children.map((child) => tweenNode(undefined, child, t)),
				}
			: { ...to, paint: fadeIn(to.paint, t) };
	}
	switch (to.kind) {
		case "group": {
			const before = new Map(
				(from as typeof to).children.map((child) => [child.key, child]),
			);
			return {
				...to,
				children: to.children.map((child) =>
					tweenNode(before.get(child.key), child, t),
				),
			};
		}
		case "rect": {
			const previous = from as typeof to;
			return {
				...to,
				x: mix(previous.x, to.x, t),
				y: mix(previous.y, to.y, t),
				width: mix(previous.width, to.width, t),
				height: mix(previous.height, to.height, t),
			};
		}
		case "circle": {
			const previous = from as typeof to;
			return {
				...to,
				cx: mix(previous.cx, to.cx, t),
				cy: mix(previous.cy, to.cy, t),
				r: mix(previous.r, to.r, t),
			};
		}
		case "line": {
			const previous = from as typeof to;
			return {
				...to,
				x1: mix(previous.x1, to.x1, t),
				y1: mix(previous.y1, to.y1, t),
				x2: mix(previous.x2, to.x2, t),
				y2: mix(previous.y2, to.y2, t),
			};
		}
		case "text": {
			const previous = from as typeof to;
			return {
				...to,
				x: mix(previous.x, to.x, t),
				y: mix(previous.y, to.y, t),
			};
		}
		case "path":
			return { ...to, d: tweenPath((from as typeof to).d, to.d, t) };
	}
}

/** `to`, `t` of the way from `from` (0 is `from`, 1 is `to`). */
export function tweenScene(
	from: ChartScene,
	to: ChartScene,
	t: number,
): ChartScene {
	if (t >= 1) {
		return to;
	}
	const before = new Map(from.nodes.map((node) => [node.key, node]));
	return {
		...to,
		nodes: to.nodes.map((node) => tweenNode(before.get(node.key), node, t)),
	};
}

/** Fast out, slow in: the motion settles rather than stops. */
export function easeOutCubic(t: number): number {
	return 1 - (1 - t) ** 3;
}
