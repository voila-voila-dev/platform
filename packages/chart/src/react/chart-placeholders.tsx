import type * as React from "react";

/**
 * Stand-ins for a chart: no data yet, or none at all. Sized like the chart
 * they replace (pass the same height), so the page does not jump when the
 * data lands. Styled with the kit's tokens when the page has them.
 */

const BOX: React.CSSProperties = {
	width: "100%",
	aspectRatio: "16 / 9",
	borderRadius: 8,
};

interface EmptyProps extends React.ComponentProps<"div"> {}

/** In place of a chart with nothing to show. Pass the localized message as children. */
export function ChartEmpty({ style, ...props }: EmptyProps) {
	return (
		<div
			data-slot="chart-empty"
			style={{
				...BOX,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 4,
				border:
					"1px dashed var(--border, color-mix(in oklab, currentColor 25%, transparent))",
				color: "var(--muted-foreground, inherit)",
				fontSize: 14,
				textAlign: "center",
				textWrap: "balance",
				...style,
			}}
			{...props}
		/>
	);
}

/** Fixed, not random, so the server and the browser render the same bars. */
const BAR_HEIGHTS = [40, 70, 55, 90, 65, 80, 50] as const;

const SKELETON_CSS = `
@keyframes voila-chart-pulse{50%{opacity:.5}}
@media (prefers-reduced-motion:no-preference){[data-slot="chart-skeleton-bar"]{animation:voila-chart-pulse 2s cubic-bezier(.4,0,.6,1) infinite}}
`;

interface SkeletonProps extends React.ComponentProps<"div"> {
	/** What a screen reader hears while the chart loads. */
	readonly label?: string;
}

/** A loading placeholder shaped like a bar chart, announced as a status. */
export function ChartSkeleton({
	label = "Chargement",
	style,
	...props
}: SkeletonProps) {
	return (
		<div
			data-slot="chart-skeleton"
			role="status"
			aria-label={label}
			style={{
				...BOX,
				display: "flex",
				alignItems: "flex-end",
				gap: 8,
				...style,
			}}
			{...props}
		>
			<style href="voila-chart-skeleton" precedence="default">
				{SKELETON_CSS}
			</style>
			{BAR_HEIGHTS.map((height) => (
				<div
					key={height}
					data-slot="chart-skeleton-bar"
					style={{
						width: "100%",
						height: `${height}%`,
						borderRadius: 6,
						background:
							"var(--muted, color-mix(in oklab, currentColor 10%, transparent))",
					}}
				/>
			))}
		</div>
	);
}
