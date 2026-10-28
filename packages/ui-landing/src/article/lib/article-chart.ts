/**
 * `bar` stands its columns up from the baseline, `horizontalBar` lays them
 * down for long category names, `stackedBar` splits each category into its
 * parts, `line` follows one value over time.
 */
export const ARTICLE_CHART_TYPES = [
	"bar",
	"horizontalBar",
	"stackedBar",
	"line",
] as const;
export type ArticleChartType = (typeof ARTICLE_CHART_TYPES)[number];

/** One colour per series, and the palette holds this many. */
export const ARTICLE_CHART_MAX_SERIES = 4;

/** The node a chart is stored as in an article's body: a void block. */
export const ARTICLE_CHART_NODE_TYPE = "chart";

/**
 * A chart written into an article: static figures, dated, with their source.
 * It is drawn beside a table of the same values, so a reader who cannot see
 * the bars still reads every figure.
 */
export interface ArticleChart {
	readonly type: ArticleChartType;
	readonly title: string;
	readonly unit: string;
	readonly categories: ReadonlyArray<string>;
	readonly series: ReadonlyArray<{
		readonly label: string;
		readonly values: ReadonlyArray<number>;
	}>;
	/** The `YYYY-MM-DD` the figures were true: a reader judges a price by its date. */
	readonly asOf: string;
	readonly source: { readonly label: string; readonly url: string };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value !== "";
}

function isSeries(value: unknown): value is ArticleChart["series"][number] {
	return (
		isRecord(value) &&
		isNonEmptyString(value.label) &&
		Array.isArray(value.values) &&
		value.values.every((figure) => Number.isFinite(figure))
	);
}

function isWellFormed(value: unknown): value is ArticleChart {
	return (
		isRecord(value) &&
		ARTICLE_CHART_TYPES.some((type) => type === value.type) &&
		isNonEmptyString(value.title) &&
		typeof value.unit === "string" &&
		Array.isArray(value.categories) &&
		value.categories.length > 0 &&
		value.categories.every(isNonEmptyString) &&
		Array.isArray(value.series) &&
		value.series.length > 0 &&
		value.series.every(isSeries) &&
		typeof value.asOf === "string" &&
		ISO_DATE.test(value.asOf) &&
		!Number.isNaN(Date.parse(value.asOf)) &&
		isRecord(value.source) &&
		isNonEmptyString(value.source.label) &&
		isNonEmptyString(value.source.url)
	);
}

function drawable(chart: ArticleChart): boolean {
	const { type, categories, series } = chart;
	return (
		series.length <= ARTICLE_CHART_MAX_SERIES &&
		series.every((one) => one.values.length === categories.length) &&
		(type === "line" ||
			series.every((one) => one.values.every((figure) => figure >= 0))) &&
		(type !== "line" || categories.length >= 2)
	);
}

/**
 * The chart a node stores, or `null` when its figures cannot be drawn: one
 * value per category and series, no negative bar, two points for a line.
 */
export function articleChartOf(value: unknown): ArticleChart | null {
	return isWellFormed(value) && drawable(value) ? value : null;
}
