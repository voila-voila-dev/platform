/**
 * The vocabulary every other core module and component speaks. Deliberately
 * plain: no class instances, no branded types, nothing that would make a scale
 * awkward to build in a test or to serialize in a snapshot.
 */

/** A row of chart data. Marks read named fields off it by key. */
export type ChartDatum = Record<string, unknown>;

/** A `[start, end]` pair. Not sorted: a range may run backwards (y axes do). */
export type ChartInterval = readonly [number, number];

/** Inner padding between the SVG edge and the plotting area. */
export interface ChartMargin {
	readonly top: number;
	readonly right: number;
	readonly bottom: number;
	readonly left: number;
}

/**
 * A continuous scale: numbers in, pixels out, and back again. `ticks` returns
 * round values inside the domain, never the raw domain bounds.
 */
export interface ChartLinearScale {
	readonly kind: "linear";
	readonly domain: ChartInterval;
	readonly range: ChartInterval;
	readonly scale: (value: number) => number;
	readonly invert: (pixel: number) => number;
	readonly ticks: (count?: number) => ReadonlyArray<number>;
	/** Continuous scales have no band, but marks ask uniformly. */
	readonly bandwidth: number;
}

/**
 * A discrete scale: one category in, the pixel offset of its slot out.
 * `bandwidth` is the slot width for band scales and `0` for point scales.
 */
export interface ChartDiscreteScale {
	readonly kind: "band" | "point";
	readonly domain: ReadonlyArray<string>;
	readonly range: ChartInterval;
	readonly scale: (value: string) => number;
	/** Centre of a category's slot — where a point or tick belongs. */
	readonly center: (value: string) => number;
	/** Nearest category index for a pixel offset. Used by pointer scrubbing. */
	readonly invert: (pixel: number) => number;
	readonly ticks: () => ReadonlyArray<string>;
	readonly bandwidth: number;
	readonly step: number;
}

export type ChartScale = ChartLinearScale | ChartDiscreteScale;

/** Whether the category axis runs along the bottom (vertical bars) or the side. */
export type ChartOrientation = "vertical" | "horizontal";

/** How a line or area joins its points. */
export type ChartCurve = "linear" | "monotone" | "step";

/** A point in plotting-area pixels. */
export interface ChartPoint {
	readonly x: number;
	readonly y: number;
}

/** Per-corner radii for a rounded bar, clockwise from the top-left. */
export type ChartCornerRadius =
	| number
	| readonly [number, number, number, number];
