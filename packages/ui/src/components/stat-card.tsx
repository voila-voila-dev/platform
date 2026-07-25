import { TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react";

import { Card } from "#/components/card.tsx";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

/**
 * KPI tile for dashboards: a Card composition pairing a muted label, a large
 * value, an optional trend delta and an optional full-bleed sparkline. Put a
 * `Chart.Root` inside `StatCardChart` — or `Chart.Skeleton` / `Chart.Empty`
 * (from `@voila.dev/ui/chart/*`) while the metric is loading or has no data.
 */
function StatCard({ className, ...props }: React.ComponentProps<typeof Card>) {
	return (
		<Card
			data-slot="stat-card"
			className={cn("gap-1.5", className)}
			{...props}
		/>
	);
}

function StatCardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="stat-card-header"
			className={cn(
				"flex items-center justify-between gap-2 px-4 group-data-[size=sm]/card:px-3",
				className,
			)}
			{...props}
		/>
	);
}

function StatCardLabel({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="stat-card-label"
			className={cn("truncate text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function StatCardValue({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="stat-card-value"
			className={cn(
				"px-4 text-2xl font-semibold tracking-tight tabular-nums group-data-[size=sm]/card:px-3",
				className,
			)}
			{...props}
		/>
	);
}

type StatCardTrend = "up" | "down" | "neutral";

const statCardDeltaVariants = cva({
	base: "inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums [&_svg]:size-3.5 [&_svg]:shrink-0",
	variants: {
		trend: {
			up: "text-success",
			down: "text-destructive",
			neutral: "text-muted-foreground",
		},
	},
	defaultVariants: {
		trend: "neutral",
	},
});

const trendIcons: Record<
	StatCardTrend,
	React.ComponentType<{ "aria-hidden"?: boolean }> | null
> = {
	up: TrendUpIcon,
	down: TrendDownIcon,
	neutral: null,
};

/**
 * Trend indicator next to the label or value. `up` renders in the success
 * color and `down` in the destructive color - for metrics where down is the
 * good direction (e.g. cancellations), invert with `className` ("text-success"
 * / "text-destructive" win over the variant color).
 */
function StatCardDelta({
	className,
	trend = "neutral",
	children,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof statCardDeltaVariants>) {
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

/**
 * Full-bleed chart slot pinned to the bottom edge of the card: the negative
 * margin cancels the card's bottom padding and the card's `overflow-hidden`
 * clips the chart to the rounded corners. Constrain the chart's height on the
 * `Chart.Root` itself (e.g. `className="h-16 w-full"`).
 */
function StatCardChart({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="stat-card-chart"
			className={cn(
				"mt-auto -mb-4 pt-2 group-data-[size=sm]/card:-mb-3",
				className,
			)}
			{...props}
		/>
	);
}

export {
	StatCard,
	StatCardChart,
	StatCardDelta,
	StatCardHeader,
	StatCardLabel,
	type StatCardTrend,
	StatCardValue,
	statCardDeltaVariants,
};
