import type {
	ChartFocusOrder,
	ChartMargin,
	ChartMark,
	ChartPositionScaleKind,
	ChartProjection,
	ChartScene,
	ChartTextMeasurer,
	ChartTheme,
	ChartValue,
} from "#/core/types.ts";

export interface ChartAxisOptions {
	/** Axis title, data-table column heading and tooltip heading. */
	readonly label?: string;
	/** `false` hides the axis; the scale still places the marks. */
	readonly axis?: boolean;
	readonly grid?: boolean;
	/** A tick count to aim for, or the exact values to tick. */
	readonly ticks?: number | ReadonlyArray<ChartValue>;
	readonly tickFormat?: (value: ChartValue) => string;
	/** How the tooltip, live region and data table write a value of this channel. */
	readonly format?: (value: ChartValue) => string;
}

export interface ChartPositionScaleOptions extends ChartAxisOptions {
	readonly type?: ChartPositionScaleKind;
	readonly domain?: ReadonlyArray<ChartValue>;
	/** Widen a continuous domain to round ticks. On by default for y. */
	readonly nice?: boolean;
	/** Keep zero on a continuous domain even when no mark asks for it. */
	readonly zero?: boolean;
	readonly reverse?: boolean;
	readonly paddingInner?: number;
	readonly paddingOuter?: number;
}

export interface ChartColorOptions {
	readonly type?: "ordinal" | "sequential";
	readonly domain?: ReadonlyArray<ChartValue>;
	/** Palette for an ordinal scale, `[from, to]` for a sequential one. */
	readonly range?: ReadonlyArray<string>;
	readonly legend?: boolean;
	/** Display names of the series, by value. */
	readonly labels?: Readonly<Record<string, string>>;
}

/**
 * Small multiples: the same chart once per value, on a grid, every cell on
 * the same scales so the cells compare at a glance.
 */
export interface ChartFacetOptions {
	readonly values: ReadonlyArray<ChartValue>;
	/** The marks of one cell. */
	readonly marks: (
		value: ChartValue,
		index: number,
	) => ReadonlyArray<ChartMark | false | null | undefined>;
	readonly label?: (value: ChartValue) => string;
	/** Cells per row. Defaults to three, or fewer when there are fewer values. */
	readonly columns?: number;
	/** Pixels between two cells. */
	readonly gap?: number;
}

/**
 * What `facet(…)` returns: the options, and the compiler that lays the cells
 * out. Carried by the spec rather than imported by the core, so a chart
 * without facets never ships the facet code.
 */
export interface ChartFacet {
	readonly options: ChartFacetOptions;
	readonly compile: (
		spec: ChartSpec,
		options: ChartFacetCompileOptions,
	) => ChartScene;
}

/** The compile options a facet compiler is handed, plus the per-cell compiler. */
export interface ChartFacetCompileOptions {
	readonly width: number;
	readonly height: number;
	readonly measureText?: ChartTextMeasurer;
	readonly hiddenSeries?: ReadonlySet<string>;
	readonly xDomain?: readonly [number, number];
	readonly compileCell: (
		spec: ChartSpec,
		options: Omit<ChartFacetCompileOptions, "compileCell">,
	) => ChartScene;
}

export interface ChartSpec {
	/** Falsy entries are skipped, so a mark can be switched on with `&&`. Unused with `facet`. */
	readonly marks?: ReadonlyArray<ChartMark | false | null | undefined>;
	readonly x?: ChartPositionScaleOptions;
	readonly y?: ChartPositionScaleOptions;
	readonly color?: ChartColorOptions;
	/** Overrides the margins the axes would reserve, side by side. */
	readonly margin?: Partial<ChartMargin>;
	readonly focus?: ChartFocusOrder;
	/** Small multiples, from `facet(…)`. With it, `marks` is ignored: each cell takes its own. */
	readonly facet?: ChartFacet;
	/** For maps: how longitude and latitude become pixels. */
	readonly projection?: ChartProjection;
	readonly locale?: string;
	readonly theme?: Partial<ChartTheme>;
}

export interface ChartBuildContext {
	readonly width: number;
	readonly height: number;
}

export interface ChartDefinition {
	readonly build: (context: ChartBuildContext) => ChartSpec;
}

/**
 * A chart as data. Pass the spec when it does not depend on the size, or a
 * builder when it does (fewer ticks on a phone, a different layout below some
 * width). Build it in `useMemo`: the definition's identity is what tells the
 * renderer the data changed.
 */
export function defineChart(
	spec: ChartSpec | ((context: ChartBuildContext) => ChartSpec),
): ChartDefinition {
	return { build: typeof spec === "function" ? spec : () => spec };
}
