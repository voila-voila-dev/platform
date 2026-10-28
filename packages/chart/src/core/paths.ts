import type { ChartCorners, ChartCurve } from "#/core/types.ts";

/** A point in chart pixels. */
export interface ChartXY {
	readonly x: number;
	readonly y: number;
}

/**
 * Path builders. Everything is SVG path data, which both renderers read: SVG
 * sets it as `d`, Canvas hands it to `Path2D`. Everything It is rounded to `PATH_PRECISION` decimals so the
 * emitted `d` attributes stay short, stable across runs and pleasant to assert
 * on in tests.
 */

const PATH_PRECISION = 2;
/** Fritsch-Carlson clamps the tangent when the slope ratio exceeds this. */
const MONOTONE_SLOPE_LIMIT = 9;

function round(value: number): number {
	const factor = 10 ** PATH_PRECISION;
	return Math.round(value * factor) / factor;
}

function point(x: number, y: number): string {
	return `${round(x)},${round(y)}`;
}

/**
 * Per-point tangents for a monotone cubic spline (Fritsch-Carlson): the curve
 * bends through the data without the overshoot a plain cubic gives you, so a
 * series that never goes negative never dips below the axis.
 */
function monotoneTangents(points: ReadonlyArray<ChartXY>): number[] {
	const count = points.length;
	const secants: number[] = [];
	for (let index = 0; index < count - 1; index += 1) {
		const run = points[index + 1].x - points[index].x;
		secants.push(run === 0 ? 0 : (points[index + 1].y - points[index].y) / run);
	}

	const tangents: number[] = [secants[0] ?? 0];
	for (let index = 1; index < count - 1; index += 1) {
		tangents.push((secants[index - 1] + secants[index]) / 2);
	}
	tangents.push(secants[count - 2] ?? 0);

	for (let index = 0; index < secants.length; index += 1) {
		const secant = secants[index];
		if (secant === 0) {
			tangents[index] = 0;
			tangents[index + 1] = 0;
			continue;
		}
		const before = tangents[index] / secant;
		const after = tangents[index + 1] / secant;
		const magnitude = before * before + after * after;
		if (magnitude > MONOTONE_SLOPE_LIMIT) {
			const scale = 3 / Math.sqrt(magnitude);
			tangents[index] = scale * before * secant;
			tangents[index + 1] = scale * after * secant;
		}
	}
	return tangents;
}

function monotoneSegments(points: ReadonlyArray<ChartXY>): string {
	const tangents = monotoneTangents(points);
	const segments: string[] = [];
	for (let index = 0; index < points.length - 1; index += 1) {
		const from = points[index];
		const to = points[index + 1];
		const third = (to.x - from.x) / 3;
		segments.push(
			`C${point(from.x + third, from.y + tangents[index] * third)} ${point(
				to.x - third,
				to.y - tangents[index + 1] * third,
			)} ${point(to.x, to.y)}`,
		);
	}
	return segments.join("");
}

/** Midpoint step: hold the value, jump halfway between the two categories. */
function stepSegments(points: ReadonlyArray<ChartXY>): string {
	const segments: string[] = [];
	for (let index = 0; index < points.length - 1; index += 1) {
		const from = points[index];
		const to = points[index + 1];
		const middle = (from.x + to.x) / 2;
		segments.push(
			`L${point(middle, from.y)}L${point(middle, to.y)}L${point(to.x, to.y)}`,
		);
	}
	return segments.join("");
}

function linearSegments(points: ReadonlyArray<ChartXY>): string {
	return points
		.slice(1)
		.map((current) => `L${point(current.x, current.y)}`)
		.join("");
}

const segmentBuilders: Record<
	ChartCurve,
	(points: ReadonlyArray<ChartXY>) => string
> = {
	linear: linearSegments,
	monotone: monotoneSegments,
	step: stepSegments,
};

/**
 * An open path through `points`. Returns `""` for fewer than two points, which
 * renders as nothing rather than as a stray dot.
 */
export function linePath(
	points: ReadonlyArray<ChartXY>,
	curve: ChartCurve = "linear",
): string {
	if (points.length < 2) {
		return "";
	}
	return `M${point(points[0].x, points[0].y)}${segmentBuilders[curve](points)}`;
}

/**
 * A closed band between a top edge and a bottom edge, both drawn with the same
 * curve, so an area and its outline never disagree. The bottom edge runs under
 * the same x positions as the top: a flat baseline, or the series below it in
 * a stack.
 */
export function areaPath(
	top: ReadonlyArray<ChartXY>,
	bottom: ReadonlyArray<ChartXY>,
	curve: ChartCurve = "linear",
): string {
	const upper = linePath(top, curve);
	if (upper === "" || bottom.length === 0) {
		return "";
	}
	const lower = [...bottom].reverse();
	return `${upper}L${point(lower[0].x, lower[0].y)}${segmentBuilders[curve](lower)}Z`;
}

/** A closed polygon — the radar mark's outline. */
export function polygonPath(points: ReadonlyArray<ChartXY>): string {
	if (points.length === 0) {
		return "";
	}
	const [head, ...rest] = points;
	const tail = rest
		.map((current) => `L${point(current.x, current.y)}`)
		.join("");
	return `M${point(head.x, head.y)}${tail}Z`;
}

function cornerRadii(
	radius: number | ChartCorners,
	width: number,
	height: number,
): readonly [number, number, number, number] {
	const raw: readonly [number, number, number, number] =
		typeof radius === "number" ? [radius, radius, radius, radius] : radius;
	const limit = Math.min(Math.abs(width), Math.abs(height)) / 2;
	return [
		Math.max(0, Math.min(raw[0], limit)),
		Math.max(0, Math.min(raw[1], limit)),
		Math.max(0, Math.min(raw[2], limit)),
		Math.max(0, Math.min(raw[3], limit)),
	];
}

export interface RoundedBarOptions {
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
	/** One radius, or `[topLeft, topRight, bottomRight, bottomLeft]`. */
	readonly radius?: number | ChartCorners;
}

/**
 * A rectangle with independently rounded corners — stacked bars round only the
 * outer end of the stack, so the inner joins stay square.
 */
export function roundedBarPath(options: RoundedBarOptions): string {
	const { x, y, width, height, radius = 0 } = options;
	if (width <= 0 || height <= 0) {
		return "";
	}
	const [topLeft, topRight, bottomRight, bottomLeft] = cornerRadii(
		radius,
		width,
		height,
	);
	const right = x + width;
	const bottom = y + height;
	return [
		`M${point(x + topLeft, y)}`,
		`H${round(right - topRight)}`,
		topRight > 0
			? `A${round(topRight)},${round(topRight)} 0 0 1 ${point(right, y + topRight)}`
			: "",
		`V${round(bottom - bottomRight)}`,
		bottomRight > 0
			? `A${round(bottomRight)},${round(bottomRight)} 0 0 1 ${point(right - bottomRight, bottom)}`
			: "",
		`H${round(x + bottomLeft)}`,
		bottomLeft > 0
			? `A${round(bottomLeft)},${round(bottomLeft)} 0 0 1 ${point(x, bottom - bottomLeft)}`
			: "",
		`V${round(y + topLeft)}`,
		topLeft > 0
			? `A${round(topLeft)},${round(topLeft)} 0 0 1 ${point(x + topLeft, y)}`
			: "",
		"Z",
	].join("");
}

const DEGREES_TO_RADIANS = Math.PI / 180;

/**
 * Angles are degrees, clockwise, zero at twelve o'clock: the way a pie chart
 * is described out loud.
 */
export function polarToCartesian(
	cx: number,
	cy: number,
	radius: number,
	angle: number,
): ChartXY {
	const radians = angle * DEGREES_TO_RADIANS;
	return {
		x: cx + radius * Math.sin(radians),
		y: cy - radius * Math.cos(radians),
	};
}

export interface ArcOptions {
	/** Centre of the circle the arc is cut from, in plot coordinates. */
	readonly cx: number;
	/** Centre of the circle the arc is cut from, in plot coordinates. */
	readonly cy: number;
	/** Inner edge. `0` makes the arc a pie wedge rather than a donut segment. */
	readonly innerRadius: number;
	/** Outer edge, in pixels from the centre. */
	readonly outerRadius: number;
	/** Degrees clockwise from twelve o'clock. */
	readonly startAngle: number;
	/** Degrees clockwise from twelve o'clock. A 360-degree sweep draws a full ring. */
	readonly endAngle: number;
}

/**
 * A pie wedge (`innerRadius` 0) or a donut segment. A sweep of 360 degrees or
 * more is drawn as two half arcs, because a single arc back to its own start
 * point renders as nothing at all.
 */
export function arcPath(options: ArcOptions): string {
	const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = options;
	const sweep = endAngle - startAngle;
	if (sweep <= 0 || outerRadius <= 0) {
		return "";
	}
	if (sweep >= 360) {
		const half = startAngle + 180;
		return `${arcPath({ ...options, endAngle: half })}${arcPath({
			...options,
			startAngle: half,
			endAngle: startAngle + 359.99,
		})}`;
	}

	const largeArc = sweep > 180 ? 1 : 0;
	const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
	const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);

	if (innerRadius <= 0) {
		return [
			`M${point(cx, cy)}`,
			`L${point(outerStart.x, outerStart.y)}`,
			`A${round(outerRadius)},${round(outerRadius)} 0 ${largeArc} 1 ${point(outerEnd.x, outerEnd.y)}`,
			"Z",
		].join("");
	}

	const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
	const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
	return [
		`M${point(outerStart.x, outerStart.y)}`,
		`A${round(outerRadius)},${round(outerRadius)} 0 ${largeArc} 1 ${point(outerEnd.x, outerEnd.y)}`,
		`L${point(innerEnd.x, innerEnd.y)}`,
		`A${round(innerRadius)},${round(innerRadius)} 0 ${largeArc} 0 ${point(innerStart.x, innerStart.y)}`,
		"Z",
	].join("");
}

/**
 * Path data for GeoJSON polygon rings already in chart pixels (what
 * d3-contour returns): every ring closed, holes drawn with the even-odd rule
 * the renderers default to.
 */
export function multiPolygonPath(
	polygons: ReadonlyArray<
		ReadonlyArray<
			ReadonlyArray<readonly [number, number] | ReadonlyArray<number>>
		>
	>,
	offsetX = 0,
	offsetY = 0,
): string {
	return polygons
		.flatMap((rings) =>
			rings.map((ring) =>
				ring.length === 0
					? ""
					: `M${ring.map(([x, y]) => point(x + offsetX, y + offsetY)).join("L")}Z`,
			),
		)
		.join("");
}
