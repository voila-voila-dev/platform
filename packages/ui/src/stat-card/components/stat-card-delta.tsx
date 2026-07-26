import { TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react";
import type * as React from "react";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";
import { statCardDeltaVariants } from "#/stat-card/components/stat-card-delta-variants.ts";

export type StatCardTrend = "up" | "down" | "neutral";

const trendIcons: Record<
	StatCardTrend,
	React.ComponentType<{ "aria-hidden"?: boolean }> | null
> = {
	up: TrendUpIcon,
	down: TrendDownIcon,
	neutral: null,
};

interface Props
	extends React.ComponentProps<"div">,
		VariantProps<typeof statCardDeltaVariants> {}

/**
 * Trend indicator next to the label or value. `up` renders in the success
 * color and `down` in the destructive color - for metrics where down is the
 * good direction (e.g. cancellations), invert with `className` ("text-success"
 * / "text-destructive" win over the variant color).
 */
export function StatCardDelta({
	className,
	trend = "neutral",
	children,
	...props
}: Props) {
	const TrendIcon = trendIcons[trend];
	return (
		<div
			data-slot="stat-card-delta"
			data-trend={trend}
			className={cn(statCardDeltaVariants({ trend }), className)}
			{...props}
		>
			{TrendIcon ? <TrendIcon aria-hidden /> : null}
			{children}
		</div>
	);
}
