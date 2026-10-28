import type { Point, Ring } from "#/interpolate/path/flatten.ts";

function distance(a: Point, b: Point): number {
	return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/** `count` points evenly spaced by arc length; a closed ring includes its closing edge. */
export function resample(ring: Ring, count: number): Point[] {
	const points = ring.closed
		? [...ring.points, ring.points[0] as Point]
		: ring.points;
	const lengths = [0];
	for (let index = 1; index < points.length; index += 1) {
		lengths.push(
			(lengths[index - 1] as number) +
				distance(points[index - 1] as Point, points[index] as Point),
		);
	}
	const total = lengths[lengths.length - 1] as number;
	if (points.length < 2 || total === 0) {
		return Array.from({ length: count }, () => points[0] as Point);
	}
	const step = total / (ring.closed ? count : Math.max(1, count - 1));
	const result: Point[] = [];
	let segment = 1;
	for (let index = 0; index < count; index += 1) {
		const along = Math.min(total, index * step);
		while (
			segment < points.length - 1 &&
			(lengths[segment] as number) < along
		) {
			segment += 1;
		}
		const [a, b] = [points[segment - 1] as Point, points[segment] as Point];
		const span =
			(lengths[segment] as number) - (lengths[segment - 1] as number);
		const t =
			span === 0 ? 0 : (along - (lengths[segment - 1] as number)) / span;
		result.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
	}
	return result;
}

export function area(points: readonly Point[]): number {
	let sum = 0;
	points.forEach((point, index) => {
		const next = points[(index + 1) % points.length] as Point;
		sum += point[0] * next[1] - next[0] * point[1];
	});
	return sum / 2;
}

export function centroid(points: readonly Point[]): Point {
	const sum = points.reduce<[number, number]>(
		(total, [x, y]) => [total[0] + x, total[1] + y],
		[0, 0],
	);
	return [sum[0] / points.length, sum[1] / points.length];
}

function cost(
	a: readonly Point[],
	b: readonly Point[],
	offset: number,
): number {
	let sum = 0;
	for (let index = 0; index < a.length; index += 1) {
		const other = b[(index + offset) % b.length] as Point;
		const point = a[index] as Point;
		sum += (point[0] - other[0]) ** 2 + (point[1] - other[1]) ** 2;
	}
	return sum;
}

/**
 * `to` rearranged so each point travels as little as it can to its partner
 * in `from`: a closed ring may start anywhere and run either way round, an
 * open one may only run backwards. Both have the same length.
 */
export function alignRing(
	from: readonly Point[],
	to: readonly Point[],
	closed: boolean,
): Point[] {
	const candidates = [to, [...to].reverse()];
	let best = {
		points: to as readonly Point[],
		offset: 0,
		cost: Number.POSITIVE_INFINITY,
	};
	for (const points of candidates) {
		const offsets = closed ? points.length : 1;
		for (let offset = 0; offset < offsets; offset += 1) {
			const value = cost(from, points, offset);
			if (value < best.cost) {
				best = { points, offset, cost: value };
			}
		}
	}
	return best.points.map(
		(_point, index) =>
			best.points[(index + best.offset) % best.points.length] as Point,
	);
}

/**
 * Pairs each ring of one shape with a ring of the other, nearest centroids and
 * closest areas first. A ring left over pairs with `undefined`: it grows from,
 * or shrinks to, its own centroid.
 */
function describe(ring: Ring) {
	return { centre: centroid(ring.points), size: Math.abs(area(ring.points)) };
}

export function matchRings(
	from: readonly Ring[],
	to: readonly Ring[],
): [Ring | undefined, Ring | undefined][] {
	const starts = from.map(describe);
	const ends = to.map(describe);
	const pairs = starts.flatMap((start, i) =>
		ends.map((end, j) => {
			const scale = Math.sqrt(Math.max(start.size, end.size, 1));
			return {
				i,
				j,
				score:
					distance(start.centre, end.centre) / scale +
					Math.abs(Math.log((start.size + 1) / (end.size + 1))),
			};
		}),
	);
	pairs.sort((a, b) => a.score - b.score);
	const usedFrom = new Set<number>();
	const usedTo = new Set<number>();
	const result: [Ring | undefined, Ring | undefined][] = [];
	for (const { i, j } of pairs) {
		if (!usedFrom.has(i) && !usedTo.has(j)) {
			usedFrom.add(i);
			usedTo.add(j);
			result.push([from[i], to[j]]);
		}
	}
	for (const [i, ring] of from.entries()) {
		if (!usedFrom.has(i)) result.push([ring, undefined]);
	}
	for (const [j, ring] of to.entries()) {
		if (!usedTo.has(j)) result.push([undefined, ring]);
	}
	return result;
}
