import * as React from "react";

import type {
	ChartCategorySpec,
	ChartValueSpec,
} from "#/chart/core/chart-model.ts";
import type { ChartConfig } from "#/chart/core/config.ts";
import type {
	ChartDatum,
	ChartDiscreteScale,
	ChartLinearScale,
	ChartMargin,
	ChartOrientation,
	ChartScale,
} from "#/chart/core/types.ts";
import type { ChartActive } from "#/chart/hooks/use-chart-pointer.ts";

export type { ChartConfig } from "#/chart/core/config.ts";

export interface ChartContextValue {
	/** Stable per-chart id. Scopes the injected `--color-<key>` variables. */
	readonly chartId: string;
	readonly config: ChartConfig;
	readonly data: ReadonlyArray<ChartDatum>;
	readonly width: number;
	readonly height: number;
	readonly margin: ChartMargin;
	readonly innerWidth: number;
	readonly innerHeight: number;
	readonly orientation: ChartOrientation;
	readonly category: ChartCategorySpec | undefined;
	readonly value: ChartValueSpec | undefined;
	readonly categories: ReadonlyArray<string>;
	readonly valueKeys: ReadonlyArray<string>;
	readonly categoryScale: ChartDiscreteScale;
	readonly valueScale: ChartLinearScale;
	readonly xScale: ChartScale;
	readonly yScale: ChartScale;
	readonly active: ChartActive | null;
	readonly setActive: React.Dispatch<React.SetStateAction<ChartActive | null>>;
	/**
	 * Where overlay parts (tooltip, legend) portal to. `null` until the root has
	 * mounted, which is exactly what keeps the server render free of them.
	 */
	readonly overlay: HTMLDivElement | null;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

export function ChartProvider({
	value,
	children,
}: {
	readonly value: ChartContextValue;
	readonly children: React.ReactNode;
}) {
	return (
		<ChartContext.Provider value={value}>{children}</ChartContext.Provider>
	);
}

/**
 * The chart every mark is drawing into. Throws rather than returning `null`:
 * a `Chart.Bars` outside a `Chart.Root` has no scales, so there is nothing
 * sensible to render and a clear error beats an empty SVG.
 */
export function useChartContext(): ChartContextValue {
	const context = React.useContext(ChartContext);
	if (context === null) {
		throw new Error("Chart parts must be used within a <Chart.Root />");
	}
	return context;
}
