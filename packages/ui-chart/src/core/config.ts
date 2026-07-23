import type * as React from "react";

/**
 * The per-series presentation map every chart is given, plus the two lookups
 * every mark needs from it: what colour to paint a key, and what to call it.
 */

/** Light and dark values for one series colour. */
export type ChartTheme = Record<"light" | "dark", string>;

export type ChartConfigItem = {
	label?: React.ReactNode;
	icon?: React.ComponentType;
} & ({ color?: string; theme?: never } | { color?: never; theme: ChartTheme });

export type ChartConfig = Record<string, ChartConfigItem>;

/** How many `--chart-N` tokens the design system defines. */
export const CHART_PALETTE_SIZE = 5;

/**
 * The colour a series is drawn in. A configured series uses the `--color-<key>`
 * variable the root injects (so light and dark both work without a re-render);
 * anything else falls back to the shared palette, cycling by draw order rather
 * than picking one arbitrary colour for every unnamed series.
 */
export function seriesColor(
	config: ChartConfig,
	key: string,
	index = 0,
): string {
	const item = config[key];
	if (
		item !== undefined &&
		(item.color !== undefined || item.theme !== undefined)
	) {
		return `var(--color-${key})`;
	}
	return `var(--chart-${(index % CHART_PALETTE_SIZE) + 1})`;
}

/** The human name of a series, falling back to its raw key. */
export function seriesLabel(config: ChartConfig, key: string): React.ReactNode {
	return config[key]?.label ?? key;
}

/**
 * Which config entry describes a row. Charts coloured per row (a pie, a status
 * breakdown) name their entries after a field on the datum — `nameKey` says
 * which one — while ordinary series charts are keyed by the series itself.
 */
export function configKeyFor(
	datum: Record<string, unknown> | undefined,
	fallbackKey: string,
	nameKey?: string,
): string {
	if (nameKey === undefined || datum === undefined) {
		return fallbackKey;
	}
	const named = datum[nameKey];
	return named === undefined || named === null ? fallbackKey : String(named);
}

/** The same, flattened to a string for `aria-label` and the data table. */
export function seriesLabelText(config: ChartConfig, key: string): string {
	const label = config[key]?.label;
	return typeof label === "string" ? label : key;
}
