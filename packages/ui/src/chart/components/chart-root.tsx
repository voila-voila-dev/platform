import * as React from "react";
import { ChartDataTable } from "#/chart/components/chart-data-table.tsx";
import { ChartStyle } from "#/chart/components/chart-style.tsx";
import {
	type ChartContextValue,
	ChartProvider,
} from "#/chart/context/chart-context.tsx";
import {
	buildChartModel,
	type ChartCategorySpec,
	type ChartValueSpec,
} from "#/chart/core/chart-model.ts";
import { type ChartConfig, seriesLabelText } from "#/chart/core/config.ts";
import type {
	ChartDatum,
	ChartMargin,
	ChartOrientation,
} from "#/chart/core/types.ts";
import { useChartDimensions } from "#/chart/hooks/use-chart-dimensions.ts";
import { useChartPointer } from "#/chart/hooks/use-chart-pointer.ts";
import { cn } from "#/lib/utils.ts";

/**
 * The frame every other chart part draws into: it measures itself, derives the
 * scales, owns the active datum and publishes all of it on context.
 *
 * Marks are placed inside the plotting area, which is the SVG inset by
 * `margin`. Chrome that is not SVG — tooltip, legend — portals into an overlay
 * layer above it, so composition stays flat at the call site.
 */

const DEFAULT_MARGIN: ChartMargin = {
	top: 8,
	right: 8,
	bottom: 24,
	left: 40,
};

interface Props extends Omit<React.ComponentProps<"div">, "children"> {
	/** Per-series labels, colours and icons. */
	readonly config: ChartConfig;
	/** The rows to plot, in the order they should appear along the category axis. */
	readonly data?: ReadonlyArray<ChartDatum>;
	/** The category axis: which field names each row. */
	readonly x?: ChartCategorySpec;
	/** The value axis: which fields are plotted, and how they combine. */
	readonly y?: ChartValueSpec;
	/** `horizontal` puts the categories down the side. */
	readonly orientation?: ChartOrientation;
	/**
	 * Space reserved around the plot for the axes and the legend. A clipped axis
	 * label almost always means this needs more room on that side.
	 */
	readonly margin?: Partial<ChartMargin>;
	/** Turns pointer scrubbing and keyboard navigation off. */
	readonly interactive?: boolean;
	/** The marks and axes. Drawn in order, so what comes last sits on top. */
	readonly children?: React.ReactNode;
}

/**
 * A one-line description of the picture, for readers who get the `role="img"`
 * label but not the drawing. The hidden data table underneath carries the
 * numbers themselves.
 */
function describeChart(
	config: ChartConfig,
	valueKeys: ReadonlyArray<string>,
	count: number,
): string {
	if (valueKeys.length === 0) {
		return "Chart";
	}
	const names = valueKeys.map((key) => seriesLabelText(config, key)).join(", ");
	return `Chart of ${names} over ${count} ${count === 1 ? "point" : "points"}`;
}

export function ChartRoot({
	id,
	className,
	config,
	data = [],
	x,
	y,
	orientation = "vertical",
	margin: marginProp,
	interactive = true,
	children,
	"aria-label": ariaLabel,
	...props
}: Props) {
	const generatedId = React.useId();
	const chartId = `chart-${id ?? generatedId.replace(/:/g, "")}`;
	const { ref, width, height } = useChartDimensions();
	const [overlay, setOverlay] = React.useState<HTMLDivElement | null>(null);

	const margin: ChartMargin = { ...DEFAULT_MARGIN, ...marginProp };
	const innerWidth = Math.max(0, width - margin.left - margin.right);
	const innerHeight = Math.max(0, height - margin.top - margin.bottom);

	const model = React.useMemo(
		() =>
			buildChartModel({
				data,
				category: x,
				value: y,
				orientation,
				innerWidth,
				innerHeight,
			}),
		[data, x, y, orientation, innerWidth, innerHeight],
	);

	const scrubbing = interactive && x !== undefined;
	const { active, setActive, handlers } = useChartPointer({
		enabled: scrubbing,
		count: data.length,
		width,
		height,
		margin,
		orientation,
		categoryScale: model.categoryScale,
	});

	const description =
		ariaLabel ?? describeChart(config, model.valueKeys, data.length);

	const context: ChartContextValue = {
		chartId,
		config,
		data,
		width,
		height,
		margin,
		innerWidth,
		innerHeight,
		orientation,
		category: x,
		value: y,
		active,
		setActive,
		overlay,
		...model,
	};

	return (
		<div
			data-slot="chart-root"
			data-chart={chartId}
			data-orientation={orientation}
			ref={ref}
			className={cn(
				// Nothing drawn here is text to copy: a finger held on a phone would
				// otherwise start selecting the axis labels instead of scrubbing.
				"relative flex aspect-video w-full select-none justify-center text-xs",
				className,
			)}
			{...props}
		>
			<ChartStyle id={chartId} config={config} />
			<svg
				data-slot="chart-svg"
				role="img"
				aria-label={description}
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				className={cn(
					"absolute inset-0 h-full w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
					// A finger moving along the categories scrubs; across them, it
					// keeps scrolling the page. Left to the browser, the first move in
					// either direction became a pan and the pointer events stopped.
					scrubbing &&
						(orientation === "vertical" ? "touch-pan-y" : "touch-pan-x"),
				)}
				{...handlers}
			>
				<g
					data-slot="chart-plot"
					transform={`translate(${margin.left},${margin.top})`}
				>
					<ChartProvider value={context}>{children}</ChartProvider>
				</g>
			</svg>
			<div
				data-slot="chart-overlay"
				ref={setOverlay}
				className="pointer-events-none absolute inset-0"
			/>
			<ChartDataTable
				caption={description}
				categoryLabel={x?.key ?? "Category"}
				categories={model.categories}
				valueKeys={model.valueKeys}
				data={data}
				config={config}
			/>
		</div>
	);
}
