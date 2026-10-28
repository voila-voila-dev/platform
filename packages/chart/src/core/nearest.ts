import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartFocusOrder,
	ChartHitShape,
	ChartPoint,
	ChartScene,
	ChartValue,
} from "#/core/types.ts";

/**
 * Focus and hit-testing, on the scene only, so SVG and Canvas behave the same.
 * A stop is what one arrow-key press moves to: one point, or every point that
 * shares a position (the column of a multi-series chart).
 */
export interface ChartFocusStop {
	readonly key: string;
	readonly points: ReadonlyArray<ChartPoint>;
	/** Where the stop sits along its axis, in chart pixels. */
	readonly at: number;
}

/** How far from a dot the pointer may be and still hover it, in pixels. */
const POINT_REACH = 24;

function positionOf(
	point: ChartPoint,
	order: ChartFocusOrder,
): ChartValue | undefined {
	return order === "y" ? point.yValue : point.xValue;
}

export function focusStops(scene: ChartScene): ReadonlyArray<ChartFocusStop> {
	const order = scene.focusOrder;
	if (order === "point") {
		return scene.points.map((point) => ({
			key: point.key,
			points: [point],
			at: point.x,
		}));
	}
	const stops = new Map<
		string,
		{ key: string; points: ChartPoint[]; at: number }
	>();
	for (const point of scene.points) {
		const position = positionOf(point, order);
		// On a faceted chart a column is a column of one cell, never across cells.
		const within = point.facet === undefined ? "" : `${point.facet}|`;
		const key = `${within}${
			position === undefined
				? `px:${Math.round(order === "y" ? point.y : point.x)}`
				: categoryKey(position)
		}`;
		const stop = stops.get(key);
		if (stop === undefined) {
			stops.set(key, {
				key,
				points: [point],
				at: order === "y" ? point.y : point.x,
			});
		} else {
			stop.points.push(point);
		}
	}
	const cellOrder = new Map(
		(scene.cells ?? []).map((cell, index) => [cell.key, index]),
	);
	const cellOf = (stop: { points: ChartPoint[] }) =>
		cellOrder.get(stop.points[0].facet ?? "") ?? 0;
	return [...stops.values()].sort(
		(left, right) => cellOf(left) - cellOf(right) || left.at - right.at,
	);
}

/** Degrees clockwise from twelve o'clock, in `[0, 360)`. */
function bearing(dx: number, dy: number): number {
	const degrees = (Math.atan2(dx, -dy) * 180) / Math.PI;
	return degrees < 0 ? degrees + 360 : degrees;
}

export function contains(hit: ChartHitShape, x: number, y: number): boolean {
	if (hit.kind === "rect") {
		const { rect } = hit;
		return (
			x >= rect.x &&
			x <= rect.x + rect.width &&
			y >= rect.y &&
			y <= rect.y + rect.height
		);
	}
	const dx = x - hit.cx;
	const dy = y - hit.cy;
	const radius = Math.hypot(dx, dy);
	if (radius < hit.innerRadius || radius > hit.outerRadius) {
		return false;
	}
	const angle = bearing(dx, dy);
	const start = ((hit.startAngle % 360) + 360) % 360;
	const sweep = hit.endAngle - hit.startAngle;
	const offset = (angle - start + 360) % 360;
	return sweep >= 360 || offset <= sweep;
}

function hitArea(hit: ChartHitShape): number {
	if (hit.kind === "rect") {
		return hit.rect.width * hit.rect.height;
	}
	const sweep = Math.min(360, hit.endAngle - hit.startAngle) / 360;
	return Math.PI * (hit.outerRadius ** 2 - hit.innerRadius ** 2) * sweep;
}

export interface ChartHit {
	readonly stop: number;
	readonly point: number;
}

function pickInStop(
	stop: ChartFocusStop,
	x: number,
	y: number,
	order: ChartFocusOrder,
): number {
	const inside = stop.points.findIndex(
		(point) => point.hit !== undefined && contains(point.hit, x, y),
	);
	if (inside !== -1) {
		return inside;
	}
	let best = 0;
	let bestDistance = Number.POSITIVE_INFINITY;
	for (const [index, point] of stop.points.entries()) {
		const distance =
			order === "y" ? Math.abs(point.x - x) : Math.abs(point.y - y);
		if (distance < bestDistance) {
			best = index;
			bestDistance = distance;
		}
	}
	return best;
}

/**
 * The stop and point under the pointer. Along a position axis the nearest
 * column wins wherever the pointer is in the plot, the way a reader scrubs a
 * time series; a scatter, pie or map needs the pointer on or near the shape.
 */
export function findNearest(
	scene: ChartScene,
	stops: ReadonlyArray<ChartFocusStop>,
	x: number,
	y: number,
): ChartHit | null {
	if (stops.length === 0) {
		return null;
	}
	const order = scene.focusOrder;
	if (order === "point") {
		// Shapes can overlap (a dot over a region, regions' bounding boxes):
		// the smallest one under the pointer is the one meant.
		let inside = -1;
		let insideArea = Number.POSITIVE_INFINITY;
		for (const [index, stop] of stops.entries()) {
			const hit = stop.points[0].hit;
			if (hit !== undefined && contains(hit, x, y)) {
				const area = hitArea(hit);
				if (area < insideArea) {
					inside = index;
					insideArea = area;
				}
			}
		}
		if (inside !== -1) {
			return { stop: inside, point: 0 };
		}
		let best = -1;
		let bestDistance = POINT_REACH;
		for (const [index, stop] of stops.entries()) {
			const point = stop.points[0];
			if (point.hit?.kind === "arc") {
				continue;
			}
			const distance = Math.hypot(point.x - x, point.y - y);
			if (distance < bestDistance) {
				best = index;
				bestDistance = distance;
			}
		}
		return best === -1 ? null : { stop: best, point: 0 };
	}
	const cell = scene.cells?.find(
		(candidate) =>
			x >= candidate.plot.x &&
			x <= candidate.plot.x + candidate.plot.width &&
			y >= candidate.plot.y &&
			y <= candidate.plot.y + candidate.plot.height,
	);
	if (scene.cells !== undefined && cell === undefined) {
		return null;
	}
	const plot = cell?.plot ?? scene.plot;
	if (
		x < plot.x ||
		x > plot.x + plot.width ||
		y < plot.y ||
		y > plot.y + plot.height
	) {
		return null;
	}
	const along = order === "y" ? y : x;
	let best = 0;
	let bestDistance = Number.POSITIVE_INFINITY;
	for (const [index, stop] of stops.entries()) {
		if (cell !== undefined && stop.points[0].facet !== cell.key) {
			continue;
		}
		const distance = Math.abs(stop.at - along);
		if (distance < bestDistance) {
			best = index;
			bestDistance = distance;
		}
	}
	return { stop: best, point: pickInStop(stops[best], x, y, order) };
}
