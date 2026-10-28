import { channelsOf, isMark } from "#/core/compile.ts";
import type {
	ChartFacet,
	ChartFacetCompileOptions,
	ChartFacetOptions,
	ChartSpec,
} from "#/core/define-chart.ts";
import { formatValue } from "#/core/format.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import { planScale } from "#/core/scales/resolve.ts";
import { DEFAULT_THEME } from "#/core/theme.ts";
import type {
	ChartHitShape,
	ChartLegendItem,
	ChartMark,
	ChartPoint,
	ChartScene,
	SceneNode,
} from "#/core/types.ts";

const DEFAULT_COLUMNS = 3;
const DEFAULT_GAP = 16;
const TITLE_GAP = 6;

function shifted(
	hit: ChartHitShape | undefined,
	dx: number,
	dy: number,
): ChartHitShape | undefined {
	if (hit === undefined) {
		return undefined;
	}
	return hit.kind === "rect"
		? {
				kind: "rect",
				rect: { ...hit.rect, x: hit.rect.x + dx, y: hit.rect.y + dy },
			}
		: { ...hit, cx: hit.cx + dx, cy: hit.cy + dy };
}

/**
 * Small multiples. Every cell is compiled as a chart of its own, on x, y and
 * colour domains planned over all the cells together, then moved to its
 * place in the grid under a title. Points carry their cell, so the keyboard
 * walks one cell's values and the tooltip names the cell.
 */
function compileFacets(
	spec: ChartSpec,
	facet: ChartFacetOptions,
	options: ChartFacetCompileOptions,
): ChartScene {
	const { compileCell, ...cellOptions } = options;
	const { width, height } = options;
	const theme = { ...DEFAULT_THEME, ...spec.theme };
	const values = facet.values;
	const columns = Math.max(
		1,
		Math.min(facet.columns ?? DEFAULT_COLUMNS, values.length),
	);
	const rows = Math.max(1, Math.ceil(values.length / columns));
	const gap = facet.gap ?? DEFAULT_GAP;
	const title = theme.fontSize + TITLE_GAP;
	const cellWidth = (width - gap * (columns - 1)) / columns;
	const cellHeight = (height - gap * (rows - 1)) / rows;
	const label = (value: (typeof values)[number]) =>
		facet.label?.(value) ?? formatValue(value, spec.locale);

	const cellMarks: ChartMark[][] = values.map((value, index) =>
		facet.marks(value, index).filter(isMark),
	);
	const everyMark = cellMarks.flat();
	const cartesian = everyMark.filter((mark) => mark.coordinate === "cartesian");
	const sharedX = planScale(channelsOf(cartesian, "x"), spec.x, "x");
	const sharedY = planScale(channelsOf(cartesian, "y"), spec.y, "y");
	const colors = channelsOf(everyMark, "color").flatMap(
		(channel) => channel.values,
	);
	const numericColors =
		colors.length > 0 && colors.every((value) => typeof value === "number");
	const colorDomain =
		spec.color?.domain ??
		(colors.length === 0
			? undefined
			: numericColors
				? [Math.min(...(colors as number[])), Math.max(...(colors as number[]))]
				: [
						...new Map(
							colors.map((value) => [categoryKey(value), value]),
						).values(),
					]);

	const nodes: SceneNode[] = [];
	const points: ChartPoint[] = [];
	const legend: ChartLegendItem[] = [];
	const cells: Array<{ key: string; label: string; plot: ChartScene["plot"] }> =
		[];
	let first: ChartScene | undefined;

	for (const [index, value] of values.entries()) {
		const key = categoryKey(value);
		const x = (index % columns) * (cellWidth + gap);
		const y = Math.floor(index / columns) * (cellHeight + gap);
		const cell = compileCell(
			{
				...spec,
				facet: undefined,
				marks: cellMarks[index],
				x: sharedX
					? { ...spec.x, domain: sharedX.domain, nice: false }
					: spec.x,
				y: sharedY
					? { ...spec.y, domain: sharedY.domain, nice: false }
					: spec.y,
				color: colorDomain
					? { ...spec.color, domain: colorDomain }
					: spec.color,
			},
			{ ...cellOptions, width: cellWidth, height: cellHeight - title },
		);
		first ??= cell;
		const dy = y + title;
		nodes.push(
			{
				kind: "text",
				key: `facet-title:${key}`,
				role: "facet-title",
				x: x + cell.plot.x,
				y,
				text: label(value),
				paint: {
					fill: theme.foreground,
					fontSize: theme.fontSize,
					fontWeight: 600,
					baseline: "top",
				},
			},
			{
				kind: "group",
				key: `facet:${key}`,
				translate: { x, y: dy },
				children: cell.nodes,
			},
		);
		for (const point of cell.points) {
			points.push({
				...point,
				key: `${key}|${point.key}`,
				x: point.x + x,
				y: point.y + dy,
				hit: shifted(point.hit, x, dy),
				facet: key,
				title: `${label(value)} · ${point.title}`,
			});
		}
		legend.push(...cell.legend);
		cells.push({
			key,
			label: label(value),
			plot: { ...cell.plot, x: cell.plot.x + x, y: cell.plot.y + dy },
		});
	}

	const distinctLegend = [
		...new Map(legend.map((item) => [item.key, item])).values(),
	];
	return {
		...(first ??
			compileCell({ ...spec, facet: undefined, marks: [] }, cellOptions)),
		width,
		height,
		plot: { x: 0, y: 0, width, height },
		nodes,
		points,
		legend: distinctLegend,
		cells,
	};
}

/**
 * Small multiples: the same chart once per value, on a grid, every cell on
 * the same scales. Pass the result as the definition's `facet`.
 */
export function facet(options: ChartFacetOptions): ChartFacet {
	return {
		options,
		compile: (spec, compileOptions) =>
			compileFacets(spec, options, compileOptions),
	};
}
