import type {
	ContentNodeLike,
	ContentNodeReader,
} from "@voila.dev/ui/content-editor/reader";
import { escapeHtml, escapeUrl } from "@voila.dev/ui/content-editor/reader";
import {
	ARTICLE_CHART_NODE_TYPE,
	type ArticleChart,
	articleChartOf,
} from "#/article/lib/article-chart.ts";

/** A chart in an article's body: a void block whose figures sit under `chart`. */
export interface ArticleChartNode extends ContentNodeLike {
	readonly type: typeof ARTICLE_CHART_NODE_TYPE;
	readonly id?: string;
	readonly chart?: unknown;
}

export interface ArticleChartLabels {
	/** "Figures as of 5 October 2026", from the `YYYY-MM-DD` the figures were true. */
	readonly asOf: (isoDate: string) => string;
	/** Printed before the source link, punctuation included: "Source:". */
	readonly source: string;
	readonly showData: string;
	readonly total: string;
	/** What a screen reader hears for the drawing, pointing at the table. */
	readonly plot: (title: string) => string;
}

export interface ArticleChartOptions {
	readonly labels: ArticleChartLabels;
	/** The BCP 47 locale the figures are written in, e.g. `fr-FR`. */
	readonly locale: string;
}

/** A chart with the number format of its locale, which every drawing needs. */
interface Plot {
	readonly chart: ArticleChart;
	readonly number: Intl.NumberFormat;
}

/** A no-break space keeps "160 €" on one line. */
function formatValue(plot: Plot, value: number): string {
	const { chart, number } = plot;
	return chart.unit === ""
		? number.format(value)
		: `${number.format(value)}\u00a0${chart.unit}`;
}

function seriesColor(index: number): string {
	return `var(--article-chart-${index + 1}, var(--chart-${index + 1}))`;
}

function percent(value: number, max: number): string {
	return `${max === 0 ? 0 : Math.round((value / max) * 10_000) / 100}%`;
}

function sum(values: ReadonlyArray<number>): number {
	return values.reduce((total, value) => total + value, 0);
}

function columnsOf(chart: ArticleChart): ReadonlyArray<ReadonlyArray<number>> {
	return chart.categories.map((_, index) =>
		chart.series.map((series) => series.values[index] ?? 0),
	);
}

function markTitle(
	plot: Plot,
	category: string,
	seriesIndex: number,
	value: number,
): string {
	const { chart } = plot;
	const series = chart.series[seriesIndex];
	const name =
		chart.series.length > 1 && series !== undefined ? ` · ${series.label}` : "";
	return escapeHtml(`${category}${name}: ${formatValue(plot, value)}`);
}

const LEGEND_KEY = {
	rect: "inline-block size-3 shrink-0 rounded-[3px]",
	line: "inline-block h-0.5 w-4 shrink-0 rounded-full",
} as const;

function legendHtml(chart: ArticleChart): string {
	if (chart.series.length < 2) {
		return "";
	}
	const key = chart.type === "line" ? LEGEND_KEY.line : LEGEND_KEY.rect;
	const items = chart.series
		.map(
			(series, index) =>
				`<li class="flex items-center gap-2"><span aria-hidden="true" class="${key}" style="background-color:${seriesColor(index)}"></span>${escapeHtml(series.label)}</li>`,
		)
		.join("");
	return `<ul class="m-0 flex list-none flex-wrap gap-x-5 gap-y-1.5 p-0 text-muted-foreground text-sm">${items}</ul>`;
}

const VALUE_LABEL = "whitespace-nowrap text-foreground text-sm tabular-nums";
const CATEGORY_LABEL = "text-foreground/80 text-sm leading-snug";

function horizontalBarsHtml(plot: Plot): string {
	const { chart } = plot;
	const columns = columnsOf(chart);
	const max = Math.max(...columns.flat());
	const rows = chart.categories
		.map((category, categoryIndex) => {
			const values = columns[categoryIndex] ?? [];
			const bars = values
				.map(
					(value, seriesIndex) =>
						`<div class="flex items-center gap-2"><span class="block h-5 rounded-e-[4px]" style="width:${percent(value, max)};background-color:${seriesColor(seriesIndex)}" title="${markTitle(plot, category, seriesIndex, value)}"></span><span class="${VALUE_LABEL}">${escapeHtml(formatValue(plot, value))}</span></div>`,
				)
				.join("");
			return `<div class="flex flex-col gap-1.5"><span class="${CATEGORY_LABEL}">${escapeHtml(category)}</span><div class="flex flex-col gap-[2px] pe-16">${bars}</div></div>`;
		})
		.join("");
	return `<div class="flex flex-col gap-4">${rows}</div>`;
}

function stackedBarsHtml(plot: Plot): string {
	const { chart } = plot;
	const columns = columnsOf(chart);
	const max = Math.max(...columns.map(sum));
	const rows = chart.categories
		.map((category, categoryIndex) => {
			const values = columns[categoryIndex] ?? [];
			const total = sum(values);
			const segments = values
				.map((value, seriesIndex) =>
					value === 0
						? ""
						: `<span class="block h-6 min-w-[3px] first:rounded-s-[4px] last:rounded-e-[4px]" style="flex:${value} 1 0%;background-color:${seriesColor(seriesIndex)}" title="${markTitle(plot, category, seriesIndex, value)}"></span>`,
				)
				.join("");
			return `<div class="flex flex-col gap-1.5"><span class="${CATEGORY_LABEL}">${escapeHtml(category)}</span><div class="flex items-center gap-2 pe-16"><span class="flex gap-[2px]" style="width:${percent(total, max)}">${segments}</span><span class="${VALUE_LABEL} font-semibold">${escapeHtml(formatValue(plot, total))}</span></div></div>`;
		})
		.join("");
	return `<div class="flex flex-col gap-4">${rows}</div>`;
}

function columnsHtml(plot: Plot): string {
	const { chart, number } = plot;
	const columns = columnsOf(chart);
	const max = Math.max(...columns.flat());
	const groups = chart.categories
		.map((category, categoryIndex) => {
			const bars = (columns[categoryIndex] ?? [])
				.map(
					(value, seriesIndex) =>
						`<div class="flex h-full min-w-0 max-w-6 flex-1 items-end"><span class="relative block w-full rounded-t-[4px]" style="height:${percent(value, max)};background-color:${seriesColor(seriesIndex)}" title="${markTitle(plot, category, seriesIndex, value)}"><span class="${VALUE_LABEL} -translate-x-1/2 absolute bottom-full left-1/2 pb-1 text-xs">${escapeHtml(number.format(value))}</span></span></div>`,
				)
				.join("");
			return `<div class="flex min-w-0 flex-1 flex-col"><div class="flex h-48 items-end justify-center gap-[2px] border-border border-b px-1 pt-6">${bars}</div><span class="${CATEGORY_LABEL} mt-2 text-center text-xs sm:text-sm">${escapeHtml(category)}</span></div>`;
		})
		.join("");
	const unit =
		chart.unit === ""
			? ""
			: `<p class="m-0 mb-2 text-muted-foreground text-xs">${escapeHtml(chart.unit)}</p>`;
	return `${unit}<div class="flex gap-2 sm:gap-4">${groups}</div>`;
}

function niceTicks(max: number): ReadonlyArray<number> {
	if (max <= 0) {
		return [0, 1];
	}
	const rough = max / 4;
	const magnitude = 10 ** Math.floor(Math.log10(rough));
	const step =
		[1, 2, 2.5, 5, 10]
			.map((factor) => factor * magnitude)
			.find((candidate) => candidate >= rough) ?? rough;
	const count = Math.ceil(max / step);
	return Array.from({ length: count + 1 }, (_, index) => index * step);
}

/**
 * The line stretches with the width (non-scaling strokes keep it 2px); the
 * dots and the labels are HTML on top, placed in percent, so text stays its
 * own size on a phone.
 */
function lineHtml(plot: Plot): string {
	const { chart, number } = plot;
	const values = chart.series.flatMap((series) => series.values);
	const minimum = Math.min(0, ...values);
	const ticks = niceTicks(Math.max(...values) - minimum).map(
		(tick) => tick + minimum,
	);
	const top = ticks.at(-1) ?? 1;
	const span = top - minimum || 1;
	const last = chart.categories.length - 1;
	function x(index: number) {
		return last === 0 ? 50 : (index / last) * 100;
	}
	function y(value: number) {
		return 100 - ((value - minimum) / span) * 100;
	}
	const grid = ticks
		.map(
			(tick) =>
				`<div class="absolute inset-x-0 border-border border-t" style="top:${y(tick)}%"><span class="-translate-y-1/2 absolute -start-1 -translate-x-full text-muted-foreground text-xs tabular-nums">${escapeHtml(number.format(tick))}</span></div>`,
		)
		.join("");
	const lines = chart.series
		.map(
			(series, seriesIndex) =>
				`<polyline fill="none" stroke="${seriesColor(seriesIndex)}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" points="${series.values.map((value, index) => `${x(index)},${y(value)}`).join(" ")}"/>`,
		)
		.join("");
	const dots = chart.series
		.flatMap((series, seriesIndex) =>
			series.values.map(
				(value, index) =>
					`<span class="-translate-x-1/2 -translate-y-1/2 absolute block size-2.5 rounded-full ring-2 ring-background" style="left:${x(index)}%;top:${y(value)}%;background-color:${seriesColor(seriesIndex)}" title="${markTitle(plot, chart.categories[index] ?? "", seriesIndex, value)}"></span>`,
			),
		)
		.join("");
	const endLabels =
		chart.series.length > 1
			? ""
			: chart.series
					.map((series) => {
						const value = series.values.at(-1) ?? 0;
						return `<span class="-translate-y-full absolute -translate-x-full whitespace-nowrap pb-2 font-semibold text-foreground text-sm tabular-nums" style="left:100%;top:${y(value)}%">${escapeHtml(formatValue(plot, value))}</span>`;
					})
					.join("");
	const categories = chart.categories
		.map(
			(category, index) =>
				`<span class="absolute top-2 whitespace-nowrap text-muted-foreground text-xs ${categoryAlignment(index, last)}" style="left:${x(index)}%">${escapeHtml(category)}</span>`,
		)
		.join("");
	const unit =
		chart.unit === ""
			? ""
			: `<p class="m-0 mb-3 text-muted-foreground text-xs">${escapeHtml(chart.unit)}</p>`;
	return `${unit}<div class="ms-8 me-2 pb-8"><div class="relative h-48">${grid}<svg aria-hidden="true" class="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>${dots}${endLabels}</div><div class="relative">${categories}</div></div>`;
}

function categoryAlignment(index: number, last: number): string {
	if (index === 0) return "";
	if (index === last) return "-translate-x-full";
	return "-translate-x-1/2 max-sm:hidden";
}

const PLOT_BY_TYPE: Readonly<
	Record<ArticleChart["type"], (plot: Plot) => string>
> = {
	bar: columnsHtml,
	horizontalBar: horizontalBarsHtml,
	stackedBar: stackedBarsHtml,
	line: lineHtml,
};

function tableHtml(plot: Plot, labels: ArticleChartLabels): string {
	const { chart } = plot;
	const columns = columnsOf(chart);
	const withTotal = chart.type === "stackedBar" && chart.series.length > 1;
	const cell = "border-border border-b px-3 py-2 text-start";
	const head = [
		`<th scope="col" class="${cell}"><span class="sr-only">${escapeHtml(chart.title)}</span></th>`,
		...chart.series.map(
			(series) =>
				`<th scope="col" class="${cell} font-semibold">${escapeHtml(series.label)}</th>`,
		),
		...(withTotal
			? [
					`<th scope="col" class="${cell} font-semibold">${escapeHtml(labels.total)}</th>`,
				]
			: []),
	].join("");
	const rows = chart.categories
		.map((category, index) => {
			const values = columns[index] ?? [];
			const cells = [...values, ...(withTotal ? [sum(values)] : [])]
				.map(
					(value) =>
						`<td class="${cell} tabular-nums">${escapeHtml(formatValue(plot, value))}</td>`,
				)
				.join("");
			return `<tr><th scope="row" class="${cell} font-normal">${escapeHtml(category)}</th>${cells}</tr>`;
		})
		.join("");
	return `<details class="group mt-2 text-sm"><summary class="cursor-pointer select-none py-3 font-medium text-foreground/80 hover:text-foreground">${escapeHtml(labels.showData)}</summary><div class="mt-3 overflow-x-auto"><table class="m-0 w-full border-collapse text-sm"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div></details>`;
}

export function articleChartHtml(
	chart: ArticleChart,
	options: ArticleChartOptions,
	id?: string,
): string {
	const { labels } = options;
	const plot: Plot = {
		chart,
		number: new Intl.NumberFormat(options.locale, { maximumFractionDigits: 2 }),
	};
	const idAttribute = id === undefined ? "" : ` id="${escapeHtml(id)}"`;
	return `<figure${idAttribute} class="not-prose my-10 flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-xs sm:p-6" data-chart="${chart.type}"><figcaption class="font-semibold text-base text-foreground leading-snug">${escapeHtml(chart.title)}</figcaption>${legendHtml(chart)}<div role="img" aria-label="${escapeHtml(labels.plot(chart.title))}">${PLOT_BY_TYPE[chart.type](plot)}</div>${tableHtml(plot, labels)}<p class="m-0 border-border border-t pt-3 text-muted-foreground text-xs leading-relaxed">${escapeHtml(labels.asOf(chart.asOf))} · ${escapeHtml(labels.source)} <a href="${escapeUrl(chart.source.url)}" class="underline underline-offset-2 hover:text-foreground" rel="noopener noreferrer">${escapeHtml(chart.source.label)}</a></p></figure>`;
}

export function ArticleChartFigure({
	chart,
	options,
	id,
}: {
	readonly chart: ArticleChart;
	readonly options: ArticleChartOptions;
	readonly id?: string;
}) {
	return (
		<div
			className="contents"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: articleChartHtml escapes every value it interpolates and passes its source URL through escapeUrl, and the static export writes the same markup
			dangerouslySetInnerHTML={{ __html: articleChartHtml(chart, options, id) }}
		/>
	);
}

export function articleChartNode(
	chartOptions: ArticleChartOptions,
): ContentNodeReader<ArticleChartNode> {
	return {
		type: ARTICLE_CHART_NODE_TYPE,
		kind: "void",
		Render: ({ node, options }) => {
			const chart = articleChartOf(node.chart);
			return chart === null ? null : (
				<ArticleChartFigure
					chart={chart}
					options={chartOptions}
					id={options.idFor?.(node) ?? node.id}
				/>
			);
		},
		toHtml: (node, _children, options) => {
			const chart = articleChartOf(node.chart);
			return chart === null
				? ""
				: articleChartHtml(
						chart,
						chartOptions,
						options.idFor?.(node) ?? node.id,
					);
		},
	};
}
