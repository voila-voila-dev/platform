import type * as React from "react";
import { ChartSlice } from "#/chart/components/chart-slice.tsx";
import { useChartContext } from "#/chart/context/chart-context.tsx";
import { readNumber } from "#/chart/core/chart-model.ts";
import { configKeyFor, seriesColor } from "#/chart/core/config.ts";
import {
	polarFrame,
	polarToCartesian,
	sliceAngles,
} from "#/chart/core/polar.ts";

interface Props extends React.ComponentProps<"g"> {
	/** Field holding each wedge's size. Defaults to the first value key. */
	readonly dataKey?: string;
	/** Field naming each wedge's config entry. Defaults to the category field. */
	readonly nameKey?: string;
	/** Fraction of the outer radius left hollow. `0` draws a full pie. */
	readonly innerRadiusRatio?: number;
	readonly padAngle?: number;
	readonly startAngle?: number;
	readonly endAngle?: number;
	/** Pixels kept clear around the wedges, for the active one to lift into. */
	readonly inset?: number;
}

/** Milliseconds each wedge waits behind the one before it, on entry. */
const STAGGER_MS = 40;

/**
 * The pie mark. Each row of data is one wedge, so the colours come from the row
 * (via `nameKey`) rather than from a series — which is also how the tooltip and
 * legend read a round chart. `ChartDonut` is the hollow variant.
 */
export function ChartPie({
	className,
	dataKey,
	nameKey,
	innerRadiusRatio = 0,
	padAngle = 1,
	startAngle = 0,
	endAngle = 360,
	inset = 8,
	...props
}: Props) {
	const {
		data,
		innerWidth,
		innerHeight,
		valueKeys,
		config,
		category,
		categories,
		active,
		setActive,
	} = useChartContext();

	const key = dataKey ?? valueKeys[0];
	if (key === undefined) {
		return null;
	}

	const { cx, cy, radius } = polarFrame({ innerWidth, innerHeight, inset });
	const innerRadius = radius * innerRadiusRatio;
	const slices = sliceAngles(
		data.map((datum) => readNumber(datum, key)),
		{ startAngle, endAngle, padAngle },
	);

	return (
		<g
			data-slot="chart-pie"
			data-variant={innerRadiusRatio > 0 ? "donut" : "pie"}
			className={className}
			{...props}
		>
			{slices.map((slice) => {
				const datum = data[slice.index];
				const configKey = configKeyFor(
					datum,
					categories[slice.index] ?? String(slice.index),
					nameKey ?? category?.key,
				);
				const state =
					active === null
						? "idle"
						: active.index === slice.index
							? "active"
							: "muted";
				// The tooltip follows the wedge's own middle: a pointer inside a ring
				// is nowhere near the category slots the root's scrubbing uses.
				const centroid = polarToCartesian(
					cx,
					cy,
					(innerRadius + radius) / 2,
					(slice.startAngle + slice.endAngle) / 2,
				);
				return (
					<ChartSlice
						key={configKey}
						data-index={slice.index}
						data-series={configKey}
						cx={cx}
						cy={cy}
						innerRadius={innerRadius}
						outerRadius={radius}
						startAngle={slice.startAngle}
						endAngle={slice.endAngle}
						state={state}
						fill={seriesColor(config, configKey, slice.index)}
						style={
							{
								"--chart-enter-delay": `${slice.index * STAGGER_MS}ms`,
							} as React.CSSProperties
						}
						onPointerEnter={() =>
							setActive({ index: slice.index, x: centroid.x, y: centroid.y })
						}
						onPointerLeave={() => setActive(null)}
					/>
				);
			})}
		</g>
	);
}
