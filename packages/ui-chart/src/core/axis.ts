import { isLinearScale } from "#/core/scales.ts";
import type { ChartScale } from "#/core/types.ts";

/**
 * Where an axis puts its ticks. Works off either kind of scale so `XAxis` and
 * `YAxis` are the same component twice, once per direction.
 */

export interface AxisTick {
	/** The domain value, before formatting. */
	readonly value: number | string;
	/** Pixel offset along the axis. */
	readonly offset: number;
}

export interface AxisTickOptions {
	/** Requested tick count. Continuous scales only; ignored by categories. */
	readonly count?: number;
	/** Minimum pixels between two rendered labels. Extra ticks are dropped. */
	readonly minTickGap?: number;
	/** Length of the axis in pixels, used to apply `minTickGap`. */
	readonly available?: number;
}

const DEFAULT_TICK_COUNT = 5;

/**
 * Keeps every `stride`-th tick. The first tick is always kept, and dropping is
 * uniform, so labels stay evenly spaced instead of bunching at one end.
 */
function thin(ticks: ReadonlyArray<AxisTick>, stride: number): AxisTick[] {
	return ticks.filter((_tick, index) => index % stride === 0);
}

export function axisTicks(
	scale: ChartScale,
	options: AxisTickOptions = {},
): ReadonlyArray<AxisTick> {
	const { count = DEFAULT_TICK_COUNT, minTickGap = 0, available = 0 } = options;

	const ticks: AxisTick[] = isLinearScale(scale)
		? scale.ticks(count).map((value) => ({ value, offset: scale.scale(value) }))
		: scale.domain.map((value) => ({ value, offset: scale.center(value) }));

	if (minTickGap <= 0 || available <= 0 || ticks.length < 2) {
		return ticks;
	}
	const stride = Math.max(
		1,
		Math.ceil((ticks.length * minTickGap) / available),
	);
	return stride === 1 ? ticks : thin(ticks, stride);
}
