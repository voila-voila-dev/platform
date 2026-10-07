import { areaPath, linePath, polygonPath } from "#/core/paths.ts";
import type {
	GeometryMotion,
	GeometryPlan,
	GeometryPoint,
	SceneGeometry,
	ScenePath,
} from "#/core/types.ts";

type Points = Extract<SceneGeometry, { kind: "points" }>;

const POINT_FIELDS = ["x", "y", "x0", "y0"] as const;

/** A line, an area or a radar outline through its points. */
export function pointsPath(geometry: SceneGeometry): string {
	if (geometry.kind !== "points") return "";
	const { runs, shape, curve } = geometry;
	if (shape === "polygon") return polygonPath(runs[0] ?? []);
	return runs
		.map((run) =>
			shape === "area"
				? areaPath(
						run,
						run.map((point) => ({
							x: point.x0 ?? point.x,
							y: point.y0 ?? point.y,
						})),
						curve,
					)
				: linePath(run, curve),
		)
		.join("");
}

function channel(key: string, field: string): string {
	return `${key}\u0001${field}`;
}

function fields(point: GeometryPoint, into: Map<string, number>) {
	for (const field of POINT_FIELDS) {
		const value = point[field];
		if (value !== undefined) into.set(channel(point.key, field), value);
	}
}

/** `point`'s numbers under `key`'s channel names: a point entering from, or folding into, a neighbour. */
function as(key: string, point: GeometryPoint): GeometryPoint {
	return { ...point, key };
}

/** The nearest of `order` around `index` that `has` knows: looking back first, then ahead. */
function neighbour(
	order: readonly string[],
	index: number,
	has: ReadonlyMap<string, GeometryPoint>,
): GeometryPoint | undefined {
	for (let at = index - 1; at >= 0; at -= 1) {
		const found = has.get(order[at] as string);
		if (found) return found;
	}
	for (let at = index + 1; at < order.length; at += 1) {
		const found = has.get(order[at] as string);
		if (found) return found;
	}
	return undefined;
}

/** The new keys, with the ones that left kept after the old point before them. */
function mergeOrder(
	before: readonly string[],
	after: readonly string[],
): string[] {
	const merged = [...after];
	const known = new Set(after);
	for (const [index, key] of before.entries()) {
		if (known.has(key)) continue;
		const previous = before[index - 1];
		merged.splice(
			previous === undefined ? 0 : merged.indexOf(previous) + 1,
			0,
			key,
		);
		known.add(key);
	}
	return merged;
}

/**
 * Points keyed by x. A point that appears enters from its nearest old
 * neighbour (a month added on the right slides out of the last one); a
 * point that leaves folds into its nearest new neighbour. Undefined when the
 * runs don't line up: the caller falls back to tweening the path.
 */
function pointsPlan(from: Points, to: Points): GeometryPlan | undefined {
	if (from.runs.length !== to.runs.length || from.shape !== to.shape)
		return undefined;
	const starts = new Map<string, number>();
	const targets = new Map<string, number>();
	const orders = to.runs.map((run, index): string[] | undefined => {
		const old = new Map(
			(from.runs[index] ?? []).map((point) => [point.key, point]),
		);
		const next = new Map(run.map((point) => [point.key, point]));
		// Two points under one key can't be told apart: tween the path instead.
		if (
			old.size !== (from.runs[index]?.length ?? 0) ||
			next.size !== run.length
		) {
			return undefined;
		}
		const order = mergeOrder([...old.keys()], [...next.keys()]);
		for (const [at, key] of order.entries()) {
			const target = next.get(key) ?? neighbour(order, at, next);
			const start = old.get(key) ?? neighbour(order, at, old) ?? target;
			if (target === undefined || start === undefined) continue;
			fields(as(key, start), starts);
			fields(as(key, target), targets);
		}
		return order;
	});
	if (orders.some((order) => order === undefined)) return undefined;
	return {
		starts,
		targets,
		build(value) {
			const area = to.runs.some((run) => run[0]?.y0 !== undefined);
			return {
				...to,
				runs: (orders as string[][]).map((order) =>
					order.map((key) => ({
						key,
						x: value(channel(key, "x")),
						y: value(channel(key, "y")),
						...(area
							? { x0: value(channel(key, "x0")), y0: value(channel(key, "y0")) }
							: {}),
					})),
				),
			};
		},
	};
}

/** A line's length along its points: what Canvas dashes against to trace it in. */
function pointsLength(geometry: SceneGeometry): number {
	if (geometry.kind !== "points") return 0;
	let length = 0;
	for (const run of geometry.runs) {
		for (let index = 1; index < run.length; index += 1) {
			const a = run[index - 1] as GeometryPoint;
			const b = run[index] as GeometryPoint;
			length += Math.hypot(b.x - a.x, b.y - a.y);
		}
	}
	// A curve runs a little longer than its chords; the dash must cover it all.
	return length * 1.1;
}

/** An area, or the line over it, grows from its lower edge. */
function collapsed(node: ScenePath): ScenePath | undefined {
	const geometry = node.geometry;
	// A line over an area carries the area's lower edge too, so the two grow as one.
	if (geometry?.kind !== "points" || geometry.runs[0]?.[0]?.y0 === undefined) {
		return undefined;
	}
	return {
		...node,
		geometry: {
			...geometry,
			runs: geometry.runs.map((run) =>
				run.map((point) => ({
					...point,
					x: point.x0 ?? point.x,
					y: point.y0 ?? point.y,
				})),
			),
		},
	};
}

/** Lines, areas and radar outlines: points keyed by x (or by axis). */
export const POINTS_MOTION: GeometryMotion = {
	plan: (from, to) =>
		from.kind === "points" && to.kind === "points"
			? pointsPlan(from, to)
			: undefined,
	draw: pointsPath,
	length: pointsLength,
	enter: (node) => (node.enter === "grow" ? collapsed(node) : undefined),
};
