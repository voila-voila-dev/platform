import type {
	ChartFocusOrder,
	ChartMargin,
	ChartMark,
	ChartPositionScaleKind,
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

export interface ChartSpec {
	/** Falsy entries are skipped, so a mark can be switched on with `&&`. */
	readonly marks: ReadonlyArray<ChartMark | false | null | undefined>;
	readonly x?: ChartPositionScaleOptions;
	readonly y?: ChartPositionScaleOptions;
	readonly color?: ChartColorOptions;
	/** Overrides the margins the axes would reserve, side by side. */
	readonly margin?: Partial<ChartMargin>;
	readonly focus?: ChartFocusOrder;
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
