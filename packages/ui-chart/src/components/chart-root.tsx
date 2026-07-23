import { cn } from "@voila.dev/ui/lib/utils";
import * as React from "react";

import { ChartDataTable } from "#/components/chart-data-table.tsx";
import { ChartStyle } from "#/components/chart-style.tsx";
import {
	type ChartContextValue,
	ChartProvider,
} from "#/context/chart-context.tsx";
import {
	buildChartModel,
	type ChartCategorySpec,
	type ChartValueSpec,
} from "#/core/chart-model.ts";
import { type ChartConfig, seriesLabelText } from "#/core/config.ts";
import type {
	ChartDatum,
	ChartMargin,
	ChartOrientation,
} from "#/core/types.ts";
import { useChartDimensions } from "#/hooks/use-chart-dimensions.ts";
import { useChartPointer } from "#/hooks/use-chart-pointer.ts";

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

export interface ChartRootProps
	extends Omit<React.ComponentProps<"div">, "children"> {
	/** Per-series labels, colours and icons. */
	readonly config: ChartConfig;
	readonly data?: ReadonlyArray<ChartDatum>;
	/** The category axis: which field names each row. */
	readonly x?: ChartCategorySpec;
	/** The value axis: which fields are plotted, and how they combine. */
	readonly y?: ChartValueSpec;
	/** `horizontal` puts the categories down the side. */
	readonly orientation?: ChartOrientation;
	readonly margin?: Partial<ChartMargin>;
	/** Turns pointer scrubbing and keyboard navigation off. */
	readonly interactive?: boolean;
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

function ChartRoot({
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
}: ChartRootProps) {
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

	const { active, setActive, handlers } = useChartPointer({
		enabled: interactive && x !== undefined,
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
				"relative flex aspect-video w-full justify-center text-xs",
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
				className="absolute inset-0 h-full w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

export { ChartRoot };
