/**
 * The vocabulary of the chart pipeline. A definition lists marks; compiling it
 * resolves scales from the marks' channels, lays out the guides, and asks each
 * mark for its scene. The scene is plain data with stable keys: the SVG and
 * Canvas renderers draw the same scene, and hit-testing, focus, tooltips and
 * the data table all read it, never the DOM.
 */

/** A value a channel can carry onto a scale. */
export type ChartValue = number | string | Date;

/** A field of the datum, or a function of it. */
export type ChartAccessor<TDatum, TValue> =
	| (keyof TDatum & string)
	| ((datum: TDatum, index: number) => TValue);

export interface ChartRect {
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
}

export interface ChartMargin {
	readonly top: number;
	readonly right: number;
	readonly bottom: number;
	readonly left: number;
}

/** `[topLeft, topRight, bottomRight, bottomLeft]`, clockwise. */
export type ChartCorners = readonly [number, number, number, number];

/** How a line or area joins its points. */
export type ChartCurve = "linear" | "monotone" | "step";

// ---------------------------------------------------------------------------
// Scales
// ---------------------------------------------------------------------------

export type ChartPositionScaleKind =
	| "linear"
	| "log"
	| "time"
	| "band"
	| "point";

/**
 * One positional scale. Every kind answers the same questions, so a mark never
 * branches on the kind: `map` places the start of a value's slot, `center` its
 * middle (they differ only on a band scale), and `invert` reads a pixel back.
 */
export interface ChartPositionScale {
	readonly kind: ChartPositionScaleKind;
	/** `[min, max]` for continuous kinds, every category for discrete ones. */
	readonly domain: ReadonlyArray<ChartValue>;
	readonly range: readonly [number, number];
	readonly map: (value: ChartValue) => number;
	readonly center: (value: ChartValue) => number;
	readonly invert: (pixel: number) => ChartValue;
	/** Slot width on a band scale, `0` everywhere else. */
	readonly bandwidth: number;
	readonly ticks: (count?: number) => ReadonlyArray<ChartValue>;
	readonly format: (value: ChartValue) => string;
}

export interface ChartColorScale {
	readonly kind: "ordinal" | "sequential";
	readonly domain: ReadonlyArray<ChartValue>;
	readonly map: (value: ChartValue) => string;
}

export interface ChartScales {
	readonly x?: ChartPositionScale;
	readonly y?: ChartPositionScale;
	readonly color?: ChartColorScale;
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

export interface ChartPaint {
	readonly fill?: string;
	readonly stroke?: string;
	readonly strokeWidth?: number;
	readonly strokeDasharray?: string;
	readonly strokeLinecap?: "butt" | "round" | "square";
	readonly strokeLinejoin?: "miter" | "round" | "bevel";
	readonly opacity?: number;
	readonly fillOpacity?: number;
	readonly strokeOpacity?: number;
	/** Fill with diagonal hatching in the fill colour: a value pencilled in, not yet true. */
	readonly hatch?: boolean;
}

export interface ChartTextPaint extends ChartPaint {
	readonly fontSize?: number;
	readonly fontWeight?: number;
	readonly textAnchor?: "start" | "middle" | "end";
	readonly baseline?: "top" | "middle" | "bottom" | "alphabetic";
}

interface SceneNodeBase {
	/** Stable across renders of the same data: what renderers reconcile on. */
	readonly key: string;
	/** The series the node draws, so a legend toggle can hide it. */
	readonly series?: string;
	/** A role for styling and tests: "mark", "axis", "grid", "label"… */
	readonly role?: string;
}

export interface SceneGroup extends SceneNodeBase {
	readonly kind: "group";
	/** Shifts the children: a facet's cell drawn at its place in the grid. Clips are in the shifted space. */
	readonly translate?: { readonly x: number; readonly y: number };
	readonly clip?: ChartRect;
	readonly children: ReadonlyArray<SceneNode>;
}

export interface SceneRect extends SceneNodeBase {
	readonly kind: "rect";
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
	readonly corners?: ChartCorners;
	readonly paint: ChartPaint;
}

/** Any outline: a line, an area, a wedge, a country. `d` is SVG path data, which `Path2D` reads as well. */
export interface ScenePath extends SceneNodeBase {
	readonly kind: "path";
	readonly d: string;
	readonly paint: ChartPaint;
}

export interface SceneCircle extends SceneNodeBase {
	readonly kind: "circle";
	readonly cx: number;
	readonly cy: number;
	readonly r: number;
	readonly paint: ChartPaint;
}

export interface SceneLine extends SceneNodeBase {
	readonly kind: "line";
	readonly x1: number;
	readonly y1: number;
	readonly x2: number;
	readonly y2: number;
	readonly paint: ChartPaint;
}

export interface SceneText extends SceneNodeBase {
	readonly kind: "text";
	readonly x: number;
	readonly y: number;
	readonly text: string;
	/** Degrees, clockwise, around `(x, y)`. */
	readonly rotate?: number;
	readonly paint: ChartTextPaint;
}

export type SceneNode =
	| SceneGroup
	| SceneRect
	| ScenePath
	| SceneCircle
	| SceneLine
	| SceneText;

/** The area a pointer has to land in to hit a point, beyond plain proximity. */
export type ChartHitShape =
	| { readonly kind: "rect"; readonly rect: ChartRect }
	| {
			readonly kind: "arc";
			readonly cx: number;
			readonly cy: number;
			readonly innerRadius: number;
			readonly outerRadius: number;
			/** Degrees clockwise from twelve o'clock. */
			readonly startAngle: number;
			readonly endAngle: number;
	  };

/**
 * One datum as the reader meets it: what the keyboard steps through, what the
 * tooltip and the live region describe, what the data table lists.
 */
export interface ChartPoint<TDatum = unknown> {
	readonly key: string;
	readonly markId: string;
	readonly index: number;
	readonly datum: TDatum;
	/** Anchor in chart pixels: where the focus ring and the tooltip go. */
	readonly x: number;
	readonly y: number;
	readonly xValue?: ChartValue;
	readonly yValue?: ChartValue;
	readonly series?: string;
	readonly seriesLabel?: string;
	readonly color: string;
	/** What the point reads as, without its series: "March 2026", "Paris". */
	readonly title: string;
	/** Its value, formatted: "1 240". */
	readonly value: string;
	readonly hit?: ChartHitShape;
	/** The facet cell the point belongs to, on a faceted chart. */
	readonly facet?: string;
}

export interface ChartLegendItem {
	readonly key: string;
	readonly label: string;
	readonly color: string;
	readonly shape: "square" | "line" | "dashed" | "dot";
}

/**
 * How the keyboard walks the points. `x` groups every point that shares an x
 * value into one stop (a column of a multi-series chart), `y` does the same
 * along y for horizontal bars, `point` visits each point on its own.
 */
export type ChartFocusOrder = "x" | "y" | "point";

export interface ChartScene {
	readonly width: number;
	readonly height: number;
	readonly plot: ChartRect;
	readonly nodes: ReadonlyArray<SceneNode>;
	readonly points: ReadonlyArray<ChartPoint>;
	readonly legend: ReadonlyArray<ChartLegendItem>;
	readonly focusOrder: ChartFocusOrder;
	readonly scales: ChartScales;
	/** Column headings of the data table and tooltip: the axis labels. */
	readonly xLabel: string;
	readonly yLabel: string;
	readonly theme: ChartTheme;
	readonly locale: string;
	/** A faceted chart's cells, each with its own plot, in reading order. */
	readonly cells?: ReadonlyArray<{
		readonly key: string;
		readonly label: string;
		readonly plot: ChartRect;
	}>;
	/** The sequential colour scale's ramp, for its legend: the colours and the ends' labels. */
	readonly colorRamp?: {
		readonly stops: ReadonlyArray<string>;
		readonly low: string;
		readonly high: string;
	};
}

// ---------------------------------------------------------------------------
// Marks
// ---------------------------------------------------------------------------

/** The values a mark puts on a scale, so the scale's domain can cover them. */
export interface ChartChannel {
	readonly values: ReadonlyArray<ChartValue>;
	/** Bars need a band; the first mark that asks for one gets it. */
	readonly discrete?: "band" | "point";
	/** A bar or an area measures from zero, so zero must be on the scale. */
	readonly includeZero?: boolean;
	/** The field the values come from: the axis title when none is given. */
	readonly label?: string;
	/** Pixels the mark reaches past its value (a dot's radius), kept inside the plot. */
	readonly inset?: number;
	/** Band padding the mark draws best with: cells touch, bars breathe. */
	readonly padding?: number;
	/** Outer band padding, when it differs: room for a ridge rising past its row. */
	readonly paddingOuter?: number;
}

/**
 * A map projection, described without naming the library that implements it
 * (`@voila.dev/chart/geo` does, with d3-geo). Declared once on the
 * definition and fitted to the plot, so every map mark draws on the same one.
 */
export interface ChartProjection {
	readonly fit: (plot: ChartRect) => ChartFittedProjection;
}

export interface ChartFittedProjection {
	/** Longitude and latitude to chart pixels; `undefined` when clipped away. */
	readonly project: (
		longitude: number,
		latitude: number,
	) => { x: number; y: number } | undefined;
	/** Path data for a GeoJSON object. */
	readonly path: (geometry: unknown) => string;
	readonly centroid: (geometry: unknown) => { x: number; y: number };
	readonly bounds: (geometry: unknown) => ChartRect;
}

export type ChartTextMeasurer = (
	text: string,
	fontSize: number,
	fontWeight?: number,
) => number;

export interface ChartTheme {
	readonly palette: ReadonlyArray<string>;
	readonly foreground: string;
	readonly muted: string;
	readonly grid: string;
	readonly background: string;
	readonly fontSize: number;
}

export interface ChartMarkContext {
	readonly scales: ChartScales;
	readonly plot: ChartRect;
	readonly theme: ChartTheme;
	readonly measureText: ChartTextMeasurer;
	readonly locale: string;
	/** A colour for a mark with no color channel: its place in the palette. */
	readonly paletteColor: (index: number) => string;
	/** The colour of one value of the color channel. */
	readonly colorOf: (value: ChartValue) => string;
	/** The display name of one value of the color channel. */
	readonly seriesLabel: (value: ChartValue) => string;
	readonly formatX: (value: ChartValue) => string;
	readonly formatY: (value: ChartValue) => string;
	readonly markIndex: number;
	/** The definition's projection, fitted to the plot. Map marks need it. */
	readonly projection?: ChartFittedProjection;
}

export interface ChartMarkScene {
	readonly nodes: ReadonlyArray<SceneNode>;
	readonly points?: ReadonlyArray<ChartPoint>;
	readonly legend?: ReadonlyArray<ChartLegendItem>;
}

/**
 * What every mark factory returns. A cartesian mark declares channels so the
 * scales cover it; a `frame` mark (pie, treemap, map) owns the whole plot and
 * ignores the x and y scales.
 */
export interface ChartMark {
	readonly id?: string;
	readonly coordinate: "cartesian" | "frame";
	readonly channels: {
		readonly x?: ChartChannel;
		readonly y?: ChartChannel;
		readonly color?: ChartChannel;
	};
	/** The keyboard order this mark reads best in. */
	readonly focusOrder?: ChartFocusOrder;
	/** `false` when the mark already names its colours itself (a labelled funnel). */
	readonly colorLegend?: boolean;
	/** What a frame mark's categories and values are called, for the table and the tooltip. */
	readonly titles?: {
		readonly category?: string;
		readonly value?: string;
	};
	readonly render: (context: ChartMarkContext) => ChartMarkScene;
}
