import * as React from "react";
import { compileChart } from "#/core/compile.ts";
import type { ChartDefinition } from "#/core/define-chart.ts";
import { type ChartAnimation, chartTiming } from "#/core/motion/timing.ts";
import { findNearest, focusStops } from "#/core/nearest.ts";
import { toNumber } from "#/core/scales/continuous.ts";
import type { ChartPoint } from "#/core/types.ts";
import {
	type ChartBrush,
	type ChartBrushRange,
	ordered,
} from "#/react/brush-contract.ts";
import { ChartDataTable } from "#/react/chart-data-table.tsx";
import { ChartColorRamp, ChartLegend } from "#/react/chart-legend.tsx";
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
import { useChartZoom } from "#/react/use-chart-zoom.ts";
import { useTextMeasurer } from "#/react/use-text-measurer.ts";

const DEFAULT_HEIGHT = 300;
const DEFAULT_INITIAL_WIDTH = 640;

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
	/**
	 * How a data update moves: `true` (a spring with no bounce), a perceived
	 * duration in milliseconds, or `{ duration, bounce, stagger }` and
	 * `{ type: "tween", easing }`. `false` snaps; reduced motion always does.
	 */
	readonly animate?: boolean | number | ChartAnimation;
	/**
	 * Zoom a continuous x: the wheel while the chart has focus, + and −,
	 * Shift and the arrows to pan, a drag to pan when zoomed, 0 to reset.
	 */
	readonly zoom?: boolean;
	/** Select a range of x by dragging or from the keyboard: `brushX({ onBrush })` from `@voila.dev/chart/brush`. */
	readonly brush?: ChartBrush;
	readonly onFocusChange?: (point: ChartPoint | null) => void;
	readonly onSelect?: (point: ChartPoint | null) => void;
}

/** A pointer that moved less than this between down and up clicked rather than dragged. */
const DRAG_THRESHOLD = 3;
const ZOOM_STEP = 0.8;
const PAN_SHARE = 0.1;

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
	zoom = false,
	brush: brushBehavior,
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

	const baseScene = React.useMemo(
		() =>
			compileChart(definition, {
				width,
				height: chartHeight,
				measureText,
				hiddenSeries: hidden,
			}),
		[definition, width, chartHeight, measureText, hidden],
	);
	const baseX = baseScene.scales.x;
	const fullX = React.useMemo<readonly [number, number] | undefined>(
		() =>
			baseX && baseX.kind !== "band" && baseX.kind !== "point"
				? [toNumber(baseX.domain[0]), toNumber(baseX.domain[1])]
				: undefined,
		[baseX],
	);
	const viewport = useChartZoom(zoom ? fullX : undefined, definition);
	const scene = React.useMemo(
		() =>
			viewport.domain === null
				? baseScene
				: compileChart(definition, {
						width,
						height: chartHeight,
						measureText,
						hiddenSeries: hidden,
						xDomain: viewport.domain,
					}),
		[
			baseScene,
			viewport.domain,
			definition,
			width,
			chartHeight,
			measureText,
			hidden,
		],
	);
	const [brush, setBrush] = React.useState<ChartBrushRange | null>(null);
	const [zoomAnnouncement, setZoomAnnouncement] = React.useState("");
	const drag = React.useRef<{
		readonly startX: number;
		readonly domain: readonly [number, number] | null;
		moved: boolean;
	} | null>(null);
	const stops = React.useMemo(() => focusStops(scene), [scene]);
	const animationTrigger = React.useMemo(
		() => [definition, hidden],
		[definition, hidden],
	);
	// An inline `animate={{ … }}` object is read by value, not identity.
	const animateKey = JSON.stringify(animate);
	const timing = React.useMemo(
		() => chartTiming(JSON.parse(animateKey)),
		[animateKey],
	);
	const shown = useAnimatedScene(scene, animationTrigger, timing);
	const messages = messagesFor(scene.locale);
	const { active, handlers } = useChartFocus({
		stops,
		order: scene.focusOrder,
		hitTest: (x, y) => findNearest(scene, stops, x, y),
		onFocusChange,
		onSelect,
	});

	const xScale = scene.scales.x;
	const xContinuous =
		xScale !== undefined && xScale.kind !== "band" && xScale.kind !== "point";

	function updateBrush(range: ChartBrushRange | null) {
		setBrush(range);
		brushBehavior?.onBrush(range);
	}

	function localX(event: React.PointerEvent<HTMLElement>): number {
		return event.clientX - event.currentTarget.getBoundingClientRect().left;
	}

	function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
		if (!brushBehavior && !(zoom && viewport.domain !== null)) {
			return;
		}
		event.currentTarget.setPointerCapture(event.pointerId);
		// A drag selects a range, not a value: the hover tooltip gives way.
		handlers.onPointerLeave();
		drag.current = {
			startX: localX(event),
			domain: viewport.domain,
			moved: false,
		};
	}

	function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
		const current = drag.current;
		if (current === null || xScale === undefined) {
			handlers.onPointerMove(event);
			return;
		}
		const x = localX(event);
		if (Math.abs(x - current.startX) > DRAG_THRESHOLD) {
			current.moved = true;
		}
		if (!current.moved) return;
		if (brushBehavior) {
			updateBrush(
				ordered(xScale, [xScale.invert(current.startX), xScale.invert(x)]),
			);
		} else if (current.domain !== null) {
			const [from, to] = current.domain;
			const perPixel = (to - from) / Math.max(1, scene.plot.width);
			viewport.pan(
				(current.startX - x) * perPixel -
					((viewport.domain?.[0] ?? from) - from),
			);
		}
	}

	function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
		if (
			drag.current !== null &&
			event.currentTarget.hasPointerCapture(event.pointerId)
		) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
	}

	function onClick(event: React.MouseEvent<HTMLDivElement>) {
		const dragged = drag.current?.moved === true;
		drag.current = null;
		if (!dragged) {
			handlers.onClick(event);
		}
	}

	function announceViewport(next: readonly [number, number] | null) {
		if (xScale === undefined) return;
		const [from, to] = next ?? fullX ?? [0, 0];
		const asValue = (value: number) =>
			xScale.kind === "time" ? new Date(value) : value;
		setZoomAnnouncement(
			messages.showing(
				xScale.format(asValue(from)),
				xScale.format(asValue(to)),
			),
		);
	}

	function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (zoom && xContinuous && fullX !== undefined) {
			const focused = active?.point.xValue;
			const [from, to] = viewport.domain ?? fullX;
			const center =
				focused === undefined ? (from + to) / 2 : toNumber(focused);
			if (event.key === "+" || event.key === "=") {
				event.preventDefault();
				viewport.zoomAround(center, ZOOM_STEP);
				return;
			}
			if (event.key === "-" || event.key === "_") {
				event.preventDefault();
				viewport.zoomAround(center, 1 / ZOOM_STEP);
				return;
			}
			if (event.key === "0") {
				event.preventDefault();
				viewport.reset();
				return;
			}
			if (
				event.shiftKey &&
				(event.key === "ArrowLeft" || event.key === "ArrowRight")
			) {
				event.preventDefault();
				viewport.pan(
					(event.key === "ArrowRight" ? 1 : -1) * viewport.span() * PAN_SHARE,
				);
				return;
			}
		}
		handlers.onKeyDown(event);
	}

	// Moving the focus says the new value; the last zoom's message gives way.
	const activeKey = active?.point.key;
	// biome-ignore lint/correctness/useExhaustiveDependencies: clears on a change of focused point only
	React.useEffect(() => {
		setZoomAnnouncement("");
	}, [activeKey]);

	const viewportKey = viewport.domain?.join(":") ?? "full";
	const previousViewport = React.useRef(viewportKey);
	// biome-ignore lint/correctness/useExhaustiveDependencies: announce a change of viewport, once
	React.useEffect(() => {
		if (previousViewport.current !== viewportKey) {
			previousViewport.current = viewportKey;
			announceViewport(viewport.domain);
		}
	}, [viewportKey]);

	// The wheel zooms only while the chart has focus: scrolling past a chart
	// must keep scrolling the page.
	const zoomRef = React.useRef({
		viewport,
		xScale,
		enabled: zoom && xContinuous,
	});
	zoomRef.current = { viewport, xScale, enabled: zoom && xContinuous };
	React.useEffect(() => {
		if (node === null) return;
		function onWheel(event: WheelEvent) {
			const { viewport: current, xScale: scale, enabled } = zoomRef.current;
			if (
				!enabled ||
				scale === undefined ||
				document.activeElement !== node ||
				node === null
			)
				return;
			event.preventDefault();
			const x = event.clientX - node.getBoundingClientRect().left;
			current.zoomAround(
				toNumber(scale.invert(x)),
				event.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP,
			);
		}
		node.addEventListener("wheel", onWheel, { passive: false });
		return () => node.removeEventListener("wheel", onWheel);
	}, [node]);

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
				data-slot="chart-frame"
				style={{ position: "relative", height: chartHeight }}
			>
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
						position: "absolute",
						inset: 0,
						touchAction: brushBehavior || zoom ? "none" : "pan-y",
						// Dragging across the plot brushes or pans; without this it
						// also selected the tick labels and the tooltip as text.
						...(brushBehavior || zoom
							? { userSelect: "none", WebkitUserSelect: "none" }
							: {}),
					}}
					{...handlers}
					onKeyDown={onKeyDown}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onClick={onClick}
				>
					<Renderer scene={shown} chartId={chartId} />
					<FocusOverlay scene={scene} active={active} theme={scene.theme} />
					{tooltip !== false && active !== null ? (
						<ChartTooltip
							active={active}
							scene={scene}
							render={renderTooltip}
						/>
					) : null}
				</div>
				{brushBehavior && xScale ? (
					<brushBehavior.Layer
						scale={xScale}
						plot={scene.plot}
						range={brush}
						messages={messages}
						onChange={updateBrush}
					/>
				) : null}
			</div>
			<div id={descriptionId} style={SR_ONLY}>
				{ariaDescription ? `${ariaDescription} ` : ""}
				{messages.keyboardHint}
				{zoom && xContinuous ? messages.zoomHint : ""}
			</div>
			<div aria-live="polite" aria-atomic="true" style={SR_ONLY}>
				{zoomAnnouncement || announcement}
			</div>
			{viewport.domain !== null ? (
				<button
					type="button"
					data-slot="chart-reset-zoom"
					onClick={() => viewport.reset()}
					style={{
						justifySelf: "end",
						border:
							"1px solid var(--border, color-mix(in oklab, currentColor 20%, transparent))",
						borderRadius: 6,
						background: "transparent",
						color: "inherit",
						font: "inherit",
						fontSize: 12,
						padding: "2px 8px",
						cursor: "pointer",
					}}
				>
					{messages.resetZoom}
				</button>
			) : null}
			{showLegend && scene.legend.length > 0 ? (
				<ChartLegend
					items={scene.legend}
					hidden={hidden}
					label={messages.legend}
					onToggle={toggle}
				/>
			) : null}
			{scene.colorRamp && legend !== false ? (
				<ChartColorRamp ramp={scene.colorRamp} label={messages.legend} />
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
