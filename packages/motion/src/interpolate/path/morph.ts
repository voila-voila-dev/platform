import { mixComplex } from "#/interpolate/complex.ts";
import {
	flattenPath,
	type Point,
	type Ring,
} from "#/interpolate/path/flatten.ts";
import { parsePath } from "#/interpolate/path/parse.ts";
import {
	alignRing,
	centroid,
	matchRings,
	resample,
} from "#/interpolate/path/rings.ts";

const MIN_POINTS = 16;
const MAX_POINTS = 512;

interface Track {
	readonly from: readonly Point[];
	readonly to: readonly Point[];
	readonly closedFrom: boolean;
	readonly closedTo: boolean;
}

function round(value: number): number {
	return Math.round(value * 100) / 100;
}

/** A ring that does not exist on one side is that side's centroid, repeated. */
function collapsed(ring: Ring, count: number): Point[] {
	return Array.from({ length: count }, () => centroid(ring.points));
}

function track(from: Ring | undefined, to: Ring | undefined): Track {
	const reference = (from ?? to) as Ring;
	const count = Math.min(
		MAX_POINTS,
		Math.max(MIN_POINTS, from?.points.length ?? 0, to?.points.length ?? 0),
	);
	const start =
		from === undefined ? collapsed(reference, count) : resample(from, count);
	const end =
		to === undefined ? collapsed(reference, count) : resample(to, count);
	const closed = (from?.closed ?? true) && (to?.closed ?? true);
	return {
		from: start,
		to: alignRing(start, end, closed),
		closedFrom: from?.closed ?? reference.closed,
		closedTo: to?.closed ?? reference.closed,
	};
}

function draw(tracks: readonly Track[], progress: number): string {
	return tracks
		.map(({ from, to, closedFrom, closedTo }) => {
			const points = from.map((point, index) => {
				const other = to[index] as Point;
				const x = round(point[0] + (other[0] - point[0]) * progress);
				const y = round(point[1] + (other[1] - point[1]) * progress);
				return `${x},${y}`;
			});
			const closed = progress < 0.5 ? closedFrom : closedTo;
			return `M${points.join("L")}${closed ? "Z" : ""}`;
		})
		.join("");
}

/**
 * A path between two paths. Same commands: the numbers mix, exactly. Any
 * other pair is flattened to polylines, each subpath resampled to a shared
 * point count by arc length, paired with its nearest counterpart and turned
 * to line up with it, so every frame is a valid path that moves as little as
 * it can. The ends are the input strings themselves.
 */
export function mixPath(
	from: string,
	to: string,
): (progress: number) => string {
	// Arc flags are 0 or 1: mixed as numbers, they would pass through 0.5.
	const hasArcs = /a/i.test(from) || /a/i.test(to);
	const same =
		from === to ? () => from : hasArcs ? undefined : mixComplex(from, to);
	if (same !== undefined) {
		return same;
	}
	const start = parsePath(from);
	const end = parsePath(to);
	if (start === undefined || end === undefined) {
		return (progress) => (progress < 0.5 ? from : to);
	}
	const tracks = matchRings(flattenPath(start), flattenPath(end)).map(
		([a, b]) => track(a, b),
	);
	return (progress) => {
		if (progress === 0) {
			return from;
		}
		return progress === 1 ? to : draw(tracks, progress);
	};
}
