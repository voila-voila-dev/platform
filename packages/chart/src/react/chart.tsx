import * as React from "react";
import { compileChart } from "#/core/compile.ts";
import type { ChartDefinition } from "#/core/define-chart.ts";
import { findNearest, focusStops } from "#/core/nearest.ts";
import type { ChartPoint } from "#/core/types.ts";
import { ChartDataTable } from "#/react/chart-data-table.tsx";
import { ChartLegend } from "#/react/chart-legend.tsx";
import {
	ChartTooltip,
	ChartTooltipContent,
	type ChartTooltipRenderProps,
} from "#/react/chart-tooltip.tsx";
import { FocusOverlay } from "#/react/focus-overlay.tsx";
import { messagesFor } from "#/react/messages.ts";
import type { ChartRenderer } from "#/react/renderer.ts";
import { SR_ONLY } from "#/react/sr-only.ts";
import { SvgRenderer } from "#/react/svg-renderer.tsx";
import { useAnimatedScene } from "#/react/use-animated-scene.ts";
import { useChartFocus } from "#/react/use-chart-focus.ts";
import { useChartWidth } from "#/react/use-chart-width.ts";
import { useTextMeasurer } from "#/react/use-text-measurer.ts";

const DEFAULT_HEIGHT = 300;
const DEFAULT_INITIAL_WIDTH = 640;
const DEFAULT_DURATION = 300;

/** Focus ring, forced colours and reduced motion: what inline styles cannot say. */
const CHART_CSS = `
[data-slot="chart-surface"]:focus-visible{outline:2px solid var(--ring,Highlight);outline-offset:2px;border-radius:4px}
@media (forced-colors:active){
[data-slot="chart-svg"] [data-role="axis"],[data-slot="chart-svg"] [data-role="axis-title"]{fill:CanvasText}
[data-slot="chart-svg"] [data-role="grid"]{stroke:GrayText}
[data-slot="chart-focus-ring"]{stroke:Highlight}
[data-slot="chart-tooltip"]{border-color:CanvasText}
}
@media (prefers-reduced-motion:no-preference){
[data-slot="chart-tooltip"]{transition:transform 80ms ease-out}
}
`;

// `title` would put a native tooltip on the whole chart; the props carry the
// accessible name as `ariaLabel` instead.
interface Props
	extends Omit<React.ComponentProps<"div">, "children" | "onSelect" | "title"> {
	readonly definition: ChartDefinition;
	/** What the chart shows, in a sentence: the screen reader's name for it. Required. */
	readonly ariaLabel: string;
	/** The takeaway, when the label alone does not carry it. */
	readonly ariaDescription?: string;
	/** Pixels. Ignored when `aspectRatio` is set. */
	readonly height?: number;
	/** Height as a share of the width: `0.5` is twice as wide as tall. */
	readonly aspectRatio?: number;
	/** Width used on the server and for the first client render, before the container is measured. */
	readonly initialWidth?: number;
	readonly renderer?: ChartRenderer;
	/** `false` turns the tooltip off; a function replaces its content. */
	readonly tooltip?:
		| boolean
		| ((props: ChartTooltipRenderProps) => React.ReactNode);
	/** Shown by default when there is more than one series. */
	readonly legend?: boolean;
	/** The visually hidden table of the values. On by default; turn it off only when the page shows the same table. */
	readonly dataTable?: boolean;
	/** Tween a data update, in milliseconds; `false` snaps. Reduced motion always snaps. */
	readonly animate?: boolean | number;
	readonly onFocusChange?: (point: ChartPoint | null) => void;
	readonly onSelect?: (point: ChartPoint | null) => void;
}

/**
 * Draws a definition. Everything a reader needs beyond the picture comes with
 * it: keyboard focus on every value, a live region that reads the focused
 * value, a legend that toggles series, and the values as a hidden table.
 */
export function Chart({
	definition,
	ariaLabel,
	ariaDescription,
	height = DEFAULT_HEIGHT,
	aspectRatio,
	initialWidth = DEFAULT_INITIAL_WIDTH,
	renderer: Renderer = SvgRenderer,
	tooltip = true,
	legend,
	dataTable = true,
	animate = true,
	onFocusChange,
	onSelect,
	style,
	...props
}: Props) {
	const chartId = React.useId().replaceAll(":", "");
	const { ref, width, node } = useChartWidth(initialWidth);
	const measureText = useTextMeasurer(node);
	const [hidden, setHidden] = React.useState<ReadonlySet<string>>(
		() => new Set(),
	);
	const chartHeight =
		aspectRatio === undefined ? height : Math.round(width * aspectRatio);

	const scene = React.useMemo(
		() =>
			compileChart(definition, {
				width,
				height: chartHeight,
				measureText,
				hiddenSeries: hidden,
			}),
		[definition, width, chartHeight, measureText, hidden],
	);
	const stops = React.useMemo(() => focusStops(scene), [scene]);
	const animationTrigger = React.useMemo(
		() => [definition, hidden],
		[definition, hidden],
	);
	const shown = useAnimatedScene(
		scene,
		animationTrigger,
		animate === false ? 0 : animate === true ? DEFAULT_DURATION : animate,
	);
	const messages = messagesFor(scene.locale);
	const { active, handlers } = useChartFocus({
		stops,
		order: scene.focusOrder,
		hitTest: (x, y) => findNearest(scene, stops, x, y),
		onFocusChange,
		onSelect,
	});

	const announcement =
		active?.source === "keyboard"
			? `${active.point.title} : ${(active.stop.points.length > 1
					? active.stop.points
					: [active.point]
				)
					.map((point) => `${point.seriesLabel ?? scene.yLabel} ${point.value}`)
					.join(", ")}`
			: "";
	const showLegend = legend ?? scene.legend.length > 1;
	const descriptionId = `${chartId}-description`;
	const renderTooltip =
		typeof tooltip === "function" ? tooltip : ChartTooltipContent;

	function toggle(key: string) {
		setHidden((current) => {
			const next = new Set(current);
			if (!next.delete(key)) {
				next.add(key);
			}
			return next;
		});
	}

	return (
		<div
			data-slot="chart"
			style={{ display: "grid", gap: 8, ...style }}
			{...props}
		>
			<style href="voila-chart" precedence="default">
				{CHART_CSS}
			</style>
			<div
				ref={ref}
				role="img"
				aria-roledescription={messages.roleDescription}
				aria-label={ariaLabel}
				aria-describedby={descriptionId}
				// The chart is one focus stop; the arrow keys move inside it, the way
				// a reader walks the values. role="img" keeps it a single named
				// graphic, the live region speaks the focused value.
				// biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard exploration of the values
				tabIndex={0}
				data-slot="chart-surface"
				style={{
					position: "relative",
					height: chartHeight,
					touchAction: "pan-y",
				}}
				{...handlers}
			>
				<Renderer scene={shown} chartId={chartId} />
				<FocusOverlay scene={scene} active={active} theme={scene.theme} />
				{tooltip !== false && active !== null ? (
					<ChartTooltip active={active} scene={scene} render={renderTooltip} />
				) : null}
			</div>
			<div id={descriptionId} style={SR_ONLY}>
				{ariaDescription ? `${ariaDescription} ` : ""}
				{messages.keyboardHint}
			</div>
			<div aria-live="polite" aria-atomic="true" style={SR_ONLY}>
				{announcement}
			</div>
			{showLegend && scene.legend.length > 0 ? (
				<ChartLegend
					items={scene.legend}
					hidden={hidden}
					label={messages.legend}
					onToggle={toggle}
				/>
			) : null}
			{dataTable ? (
				<ChartDataTable
					scene={scene}
					stops={stops}
					caption={messages.dataTable(ariaLabel)}
					seriesHeading={messages.series}
				/>
			) : null}
		</div>
	);
}
