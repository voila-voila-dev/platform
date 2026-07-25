import { bandScale, linearScale, pointScale } from "#/chart/core/scales.ts";
import { extentFromZero, niceDomain } from "#/chart/core/ticks.ts";
import type {
	ChartDatum,
	ChartDiscreteScale,
	ChartLinearScale,
	ChartOrientation,
	ChartScale,
} from "#/chart/core/types.ts";

/**
 * Turns raw rows plus a pair of axis declarations into the two scales every
 * cartesian mark reads. Pure and synchronous: the components only ever call it
 * inside a `useMemo`, and the tests call it directly.
 */

export interface ChartCategorySpec {
	/** Field on each datum holding the category label. */
	readonly key: string;
	/** `band` leaves room for bars; `point` pins lines to the plot edges. */
	readonly type?: "band" | "point";
	readonly paddingInner?: number;
	readonly paddingOuter?: number;
}

export interface ChartValueSpec {
	/** Fields plotted against the value axis, in draw order. */
	readonly keys: ReadonlyArray<string>;
	/** Overrides the computed domain — use it to pin an axis to `[0, 100]`. */
	readonly domain?: readonly [number, number];
	/** Sum the keys per datum instead of taking their maximum. */
	readonly stacked?: boolean;
	/** Round the domain out to whole ticks. On by default. */
	readonly nice?: boolean;
}

export interface ChartModelOptions {
	readonly data: ReadonlyArray<ChartDatum>;
	readonly category?: ChartCategorySpec;
	readonly value?: ChartValueSpec;
	readonly orientation: ChartOrientation;
	readonly innerWidth: number;
	readonly innerHeight: number;
}

export interface ChartModel {
	readonly categories: ReadonlyArray<string>;
	readonly valueKeys: ReadonlyArray<string>;
	readonly categoryScale: ChartDiscreteScale;
	readonly valueScale: ChartLinearScale;
	readonly xScale: ChartScale;
	readonly yScale: ChartScale;
}

/** Reads a numeric field, treating anything unparseable as zero. */
export function readNumber(datum: ChartDatum, key: string): number {
	const value = datum[key];
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}
	if (typeof value === "string") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	return 0;
}

function categoryLabels(
	data: ReadonlyArray<ChartDatum>,
	spec: ChartCategorySpec | undefined,
): ReadonlyArray<string> {
	return data.map((datum, index) => {
		const raw = spec === undefined ? undefined : datum[spec.key];
		return raw === undefined || raw === null ? String(index) : String(raw);
	});
}

/**
 * The extent the value axis has to cover. Stacked series are summed per datum
 * (positives and negatives apart, so a stack that crosses zero still fits);
 * grouped series are compared one by one.
 */
function valueExtent(
	data: ReadonlyArray<ChartDatum>,
	spec: ChartValueSpec,
): readonly [number, number] {
	if (!spec.stacked) {
		return extentFromZero(
			data.flatMap((datum) => spec.keys.map((key) => readNumber(datum, key))),
		);
	}
	const totals = data.flatMap((datum) => {
		let positive = 0;
		let negative = 0;
		for (const key of spec.keys) {
			const value = readNumber(datum, key);
			if (value >= 0) {
				positive += value;
			} else {
				negative += value;
			}
		}
		return [positive, negative];
	});
	return extentFromZero(totals);
}

function buildCategoryScale(
	categories: ReadonlyArray<string>,
	spec: ChartCategorySpec | undefined,
	range: readonly [number, number],
): ChartDiscreteScale {
	if (spec?.type === "point") {
		return pointScale({ domain: categories, range });
	}
	return bandScale({
		domain: categories,
		range,
		paddingInner: spec?.paddingInner,
		paddingOuter: spec?.paddingOuter,
	});
}

export function buildChartModel(options: ChartModelOptions): ChartModel {
	const { data, category, value, orientation, innerWidth, innerHeight } =
		options;
	const isVertical = orientation === "vertical";
	const categories = categoryLabels(data, category);
	const valueSpec: ChartValueSpec = value ?? { keys: [] };

	const rawExtent = valueSpec.domain ?? valueExtent(data, valueSpec);
	const domain =
		valueSpec.domain !== undefined || valueSpec.nice === false
			? rawExtent
			: niceDomain(rawExtent[0], rawExtent[1]);

	const categoryScale = buildCategoryScale(
		categories,
		category,
		isVertical ? [0, innerWidth] : [0, innerHeight],
	);
	const valueScale = linearScale({
		domain,
		// A value axis grows upwards, so its pixel range runs backwards.
		range: isVertical ? [innerHeight, 0] : [0, innerWidth],
	});

	return {
		categories,
		valueKeys: valueSpec.keys,
		categoryScale,
		valueScale,
		xScale: isVertical ? categoryScale : valueScale,
		yScale: isVertical ? valueScale : categoryScale,
	};
}
