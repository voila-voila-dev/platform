import { resolveEasing } from "#/easing/named.ts";
import type { EasingDefinition } from "#/easing/types.ts";

export interface StaggerOptions {
	/** Seconds before the first one starts. */
	readonly startDelay?: number;
	/** Which one starts first; the others follow by their distance from it. */
	readonly from?: "first" | "last" | "center" | number;
	/** Spreads the delays along an easing instead of evenly. */
	readonly ease?: EasingDefinition;
}

const ORIGINS: Record<"first" | "last" | "center", (total: number) => number> =
	{
		first: () => 0,
		last: (total) => total - 1,
		center: (total) => (total - 1) / 2,
	};

/** A `delay` for many targets: `gap` seconds between neighbours. */
export function stagger(
	gap = 0.1,
	options: StaggerOptions = {},
): (index: number, total: number) => number {
	const { startDelay = 0, from = "first", ease } = options;
	return (index, total) => {
		const origin = typeof from === "number" ? from : ORIGINS[from](total);
		const distance = Math.abs(index - origin);
		if (ease === undefined) return startDelay + distance * gap;
		const furthest = Math.max(origin, total - 1 - origin);
		const spread = furthest * gap;
		return furthest === 0
			? startDelay
			: startDelay + resolveEasing(ease)(distance / furthest) * spread;
	};
}
