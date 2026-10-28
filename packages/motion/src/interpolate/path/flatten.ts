import type { PathCommand } from "#/interpolate/path/parse.ts";

export type Point = readonly [number, number];

/** One subpath as a polyline. */
export interface Ring {
	readonly points: readonly Point[];
	readonly closed: boolean;
}

const MAX_SEGMENTS = 256;

/** Enough segments that no chord strays more than `tolerance` from its curve. */
function segmentsFor(bend: number, tolerance: number): number {
	return Math.min(
		MAX_SEGMENTS,
		Math.max(1, Math.ceil(Math.sqrt((0.75 * bend) / tolerance))),
	);
}

function cubic(
	from: Point,
	values: readonly number[],
	tolerance: number,
): Point[] {
	const [x1, y1, x2, y2, x, y] = values as [
		number,
		number,
		number,
		number,
		number,
		number,
	];
	const [x0, y0] = from;
	const bend = Math.max(
		Math.hypot(x0 - 2 * x1 + x2, y0 - 2 * y1 + y2),
		Math.hypot(x1 - 2 * x2 + x, y1 - 2 * y2 + y),
	);
	const count = segmentsFor(bend, tolerance);
	return Array.from({ length: count }, (_unused, index) => {
		const t = (index + 1) / count;
		const u = 1 - t;
		const [a, b, c, d] = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
		return [a * x0 + b * x1 + c * x2 + d * x, a * y0 + b * y1 + c * y2 + d * y];
	});
}

function quadratic(
	from: Point,
	values: readonly number[],
	tolerance: number,
): Point[] {
	const [x1, y1, x, y] = values as [number, number, number, number];
	const [x0, y0] = from;
	const count = segmentsFor(
		Math.hypot(x0 - 2 * x1 + x, y0 - 2 * y1 + y) / 3,
		tolerance,
	);
	return Array.from({ length: count }, (_unused, index) => {
		const t = (index + 1) / count;
		const u = 1 - t;
		return [
			u * u * x0 + 2 * u * t * x1 + t * t * x,
			u * u * y0 + 2 * u * t * y1 + t * t * y,
		];
	});
}

function angleBetween(ux: number, uy: number, vx: number, vy: number): number {
	return Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
}

/** SVG's endpoint arc, converted to its centre form (SVG 1.1, appendix F.6.5). */
function arc(
	from: Point,
	values: readonly number[],
	tolerance: number,
): Point[] {
	const [rxIn, ryIn, degrees, large, sweep, x2, y2] = values as [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
	];
	const [x1, y1] = from;
	if (rxIn === 0 || ryIn === 0) {
		return [[x2, y2]];
	}
	const phi = (degrees * Math.PI) / 180;
	const [cos, sin] = [Math.cos(phi), Math.sin(phi)];
	const dx = (x1 - x2) / 2;
	const dy = (y1 - y2) / 2;
	const x1p = cos * dx + sin * dy;
	const y1p = -sin * dx + cos * dy;
	const scale = Math.max(
		1,
		Math.sqrt((x1p * x1p) / (rxIn * rxIn) + (y1p * y1p) / (ryIn * ryIn)),
	);
	const rx = Math.abs(rxIn) * scale;
	const ry = Math.abs(ryIn) * scale;
	const numerator =
		rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
	const denominator = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
	const coefficient =
		(large === sweep ? -1 : 1) *
		Math.sqrt(Math.max(0, numerator / (denominator || 1)));
	const cxp = (coefficient * rx * y1p) / ry;
	const cyp = (-coefficient * ry * x1p) / rx;
	const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
	const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
	const start = angleBetween(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
	let delta = angleBetween(
		(x1p - cxp) / rx,
		(y1p - cyp) / ry,
		(-x1p - cxp) / rx,
		(-y1p - cyp) / ry,
	);
	if (sweep === 0 && delta > 0) {
		delta -= 2 * Math.PI;
	}
	if (sweep === 1 && delta < 0) {
		delta += 2 * Math.PI;
	}
	const radius = Math.max(rx, ry);
	const step = 2 * Math.acos(Math.max(-1, 1 - tolerance / radius));
	const count = Math.min(
		MAX_SEGMENTS,
		Math.max(1, Math.ceil(Math.abs(delta) / step)),
	);
	return Array.from({ length: count }, (_unused, index): Point => {
		if (index === count - 1) {
			return [x2, y2];
		}
		const theta = start + (delta * (index + 1)) / count;
		const [c, s] = [Math.cos(theta), Math.sin(theta)];
		return [cx + rx * c * cos - ry * s * sin, cy + rx * c * sin + ry * s * cos];
	});
}

const CURVES = { C: cubic, Q: quadratic, A: arc } as const;

/** Every subpath of a parsed path as a polyline; `tolerance` in path units. */
export function flattenPath(
	commands: readonly PathCommand[],
	tolerance = 0.25,
): Ring[] {
	const rings: { points: Point[]; closed: boolean }[] = [];
	let current: { points: Point[]; closed: boolean } = {
		points: [],
		closed: false,
	};
	let start: Point = [0, 0];
	for (const command of commands) {
		if (command.type === "M" || current.closed) {
			start = command.type === "M" ? command.values : start;
			current = { points: [start], closed: false };
			rings.push(current);
		}
		const last = current.points[current.points.length - 1] as Point;
		switch (command.type) {
			case "M":
				break;
			case "L":
				current.points.push(command.values);
				break;
			case "Z":
				current.closed = true;
				break;
			default:
				current.points.push(
					...CURVES[command.type](last, command.values, tolerance),
				);
		}
	}
	return rings.map(({ points, closed }) => {
		const first = points[0] as Point;
		const end = points[points.length - 1] as Point;
		const repeats =
			closed && points.length > 1 && first[0] === end[0] && first[1] === end[1];
		return { points: repeats ? points.slice(0, -1) : points, closed };
	});
}
