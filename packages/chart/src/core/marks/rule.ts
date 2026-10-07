import { isPlaceable, readChannel } from "#/core/channel.ts";
import { markId, paint, valueOn } from "#/core/marks/shared.ts";
import { categoryKey } from "#/core/scales/discrete.ts";
import type {
	ChartAccessor,
	ChartMark,
	ChartPositionScale,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export interface RuleOptions<TDatum> {
	readonly id?: string;
	/** The value of each rule. Defaults to the datum itself, so `ruleY([0])` works. */
	readonly value?: ChartAccessor<TDatum, ChartValue>;
	readonly stroke?: string;
	readonly strokeWidth?: number;
	readonly strokeDasharray?: string;
	readonly opacity?: number;
	/** Text written at the end of the rule: "Objectif", "Moyenne". */
	readonly label?: string;
	/**
	 * On a band or point axis, `before` draws the rule between the value's
	 * column and the one before it: where a period starts, not its middle.
	 */
	readonly position?: "center" | "before";
}

const LABEL_GAP = 4;

/** Halfway between a category's slot and the previous one's, or its own start for the first. */
function before(scale: ChartPositionScale, value: ChartValue): number {
	if (scale.kind !== "band" && scale.kind !== "point") {
		return scale.center(value);
	}
	const index = scale.domain.findIndex(
		(candidate) => categoryKey(candidate) === categoryKey(value),
	);
	const previous = scale.domain[index - 1];
	if (index <= 0 || previous === undefined) {
		return scale.map(value);
	}
	return (scale.map(previous) + scale.bandwidth + scale.map(value)) / 2;
}

function ruleMark<TDatum>(
	kind: "ruleY" | "ruleX",
	data: ReadonlyArray<TDatum>,
	options: RuleOptions<TDatum>,
): ChartMark {
	const horizontal = kind === "ruleY";
	const values = readChannel(
		data,
		options.value ?? ((datum: TDatum) => datum as unknown as ChartValue),
	);
	const channel = { values: values.filter(isPlaceable) };
	return {
		id: options.id,
		coordinate: "cartesian",
		channels: horizontal ? { y: channel } : { x: channel },
		render(context) {
			const id = markId(options.id, kind, context);
			const scale = horizontal ? context.scales.y : context.scales.x;
			if (scale === undefined) {
				return { nodes: [] };
			}
			const { plot, theme } = context;
			const stroke = options.stroke ?? theme.foreground;
			const nodes: SceneNode[] = [];
			for (const [index, raw] of values.entries()) {
				const value = valueOn(scale, raw);
				if (value === undefined) {
					continue;
				}
				const at =
					options.position === "before"
						? before(scale, value)
						: scale.center(value);
				nodes.push({
					kind: "line",
					key: `${id}:${index}`,
					role: "rule",
					...(horizontal
						? { x1: plot.x, y1: at, x2: plot.x + plot.width, y2: at }
						: { x1: at, y1: plot.y, x2: at, y2: plot.y + plot.height }),
					paint: paint({
						stroke,
						strokeWidth: options.strokeWidth ?? 1,
						strokeDasharray: options.strokeDasharray,
						opacity: options.opacity,
					}),
				});
				if (options.label !== undefined) {
					nodes.push({
						kind: "text",
						key: `${id}:label:${index}`,
						role: "label",
						x: horizontal ? plot.x + plot.width : at + LABEL_GAP,
						y: horizontal ? at - LABEL_GAP : plot.y,
						text: options.label,
						paint: {
							fill: stroke,
							fontSize: theme.fontSize,
							textAnchor: horizontal ? "end" : "start",
							baseline: horizontal ? "bottom" : "top",
						},
					});
				}
			}
			return { nodes };
		},
	};
}

/** Horizontal rules at y values: a baseline, a target, an average. */
export function ruleY<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: RuleOptions<TDatum> = {},
): ChartMark {
	return ruleMark("ruleY", data, options);
}

/** Vertical rules at x values: a date, a threshold. */
export function ruleX<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: RuleOptions<TDatum> = {},
): ChartMark {
	return ruleMark("ruleX", data, options);
}
