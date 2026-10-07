import type { ChartPositionScaleOptions } from "#/core/define-chart.ts";
import { linearScale, logScale, toNumber } from "#/core/scales/continuous.ts";
import { bandScale, categoryKey, pointScale } from "#/core/scales/discrete.ts";
import { timeScale } from "#/core/scales/time.ts";
import { niceDomain } from "#/core/ticks.ts";
import type {
	ChartChannel,
	ChartPositionScale,
	ChartPositionScaleKind,
	ChartValue,
} from "#/core/types.ts";

/**
 * What a scale will be once the plot size is known: its kind and its domain,
 * read off every channel the marks put on it. Split from the range so the
 * axes can measure their tick labels before the plot rectangle exists.
 */
export interface ScalePlan {
	readonly kind: ChartPositionScaleKind;
	readonly domain: ReadonlyArray<ChartValue>;
	readonly label: string | undefined;
	/** The band padding a mark asked for, when the options name none. */
	readonly padding?: number;
}

function inferKind(
	channels: ReadonlyArray<ChartChannel>,
	values: ReadonlyArray<ChartValue>,
): ChartPositionScaleKind {
	if (channels.some((channel) => channel.discrete === "band")) {
		return "band";
	}
	const askedPoint = channels.some((channel) => channel.discrete === "point");
	if (values.length > 0 && values.every((value) => value instanceof Date)) {
		return askedPoint ? "point" : "time";
	}
	if (values.length > 0 && values.every((value) => typeof value === "number")) {
		return askedPoint ? "point" : "linear";
	}
	return "point";
}

function distinct(
	values: ReadonlyArray<ChartValue>,
): ReadonlyArray<ChartValue> {
	const seen = new Set<string>();
	const kept: ChartValue[] = [];
	for (const value of values) {
		const key = categoryKey(value);
		if (!seen.has(key)) {
			seen.add(key);
			kept.push(value);
		}
	}
	return kept;
}

function continuousDomain(
	values: ReadonlyArray<ChartValue>,
	options: { readonly zero: boolean; readonly nice: boolean },
	kind: ChartPositionScaleKind,
): readonly [number, number] {
	let low = Number.POSITIVE_INFINITY;
	let high = Number.NEGATIVE_INFINITY;
	for (const value of values) {
		const number = toNumber(value);
		if (Number.isFinite(number)) {
			low = Math.min(low, number);
			high = Math.max(high, number);
		}
	}
	if (!Number.isFinite(low)) {
		return [0, 1];
	}
	if (options.zero && kind === "linear") {
		low = Math.min(low, 0);
		high = Math.max(high, 0);
	}
	if (options.nice && kind === "linear") {
		return niceDomain(low, high);
	}
	return [low, high];
}

export function planScale(
	channels: ReadonlyArray<ChartChannel>,
	options: ChartPositionScaleOptions | undefined,
	axis: "x" | "y",
): ScalePlan | undefined {
	if (channels.length === 0) {
		return undefined;
	}
	const values = channels.flatMap((channel) => channel.values);
	const kind = options?.type ?? inferKind(channels, values);
	const label =
		options?.label ?? channels.find((channel) => channel.label)?.label;
	if (kind === "band" || kind === "point") {
		const padding = channels.find(
			(channel) => channel.padding !== undefined,
		)?.padding;
		return {
			kind,
			domain: options?.domain ?? distinct(values),
			label,
			padding,
		};
	}
	if (options?.domain !== undefined) {
		return { kind, domain: options.domain.map(toNumber), label };
	}
	const zero =
		options?.zero ?? channels.some((channel) => channel.includeZero === true);
	// A value axis (y, or the x of horizontal bars) reads best on round
	// numbers; a position axis (the x of a scatter) on the data's own extent.
	const nice = options?.nice ?? (axis === "y" || zero);
	return {
		kind,
		domain: continuousDomain(values, { zero, nice }, kind),
		label,
	};
}

export function buildScale(
	plan: ScalePlan,
	options: ChartPositionScaleOptions | undefined,
	range: readonly [number, number],
	locale: string,
	tickCount: number,
): ChartPositionScale {
	const ordered: readonly [number, number] = options?.reverse
		? [range[1], range[0]]
		: range;
	if (plan.kind === "band" || plan.kind === "point") {
		const discrete = {
			domain: plan.domain,
			range: ordered,
			locale,
			paddingInner: options?.paddingInner ?? plan.padding,
			paddingOuter: options?.paddingOuter ?? plan.padding,
		};
		return plan.kind === "band" ? bandScale(discrete) : pointScale(discrete);
	}
	const continuous = {
		domain: [toNumber(plan.domain[0]), toNumber(plan.domain[1])] as const,
		range: ordered,
		locale,
		tickCount,
	};
	if (plan.kind === "time") {
		return timeScale(continuous);
	}
	return plan.kind === "log" ? logScale(continuous) : linearScale(continuous);
}
