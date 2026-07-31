import { Chart, type ChartConfig } from "@voila.dev/ui/chart";
import type { ReactNode } from "react";

export const data = [
	{ month: "January", projects: 24, proposals: 18 },
	{ month: "February", projects: 31, proposals: 22 },
	{ month: "March", projects: 28, proposals: 25 },
	{ month: "April", projects: 35, proposals: 30 },
	{ month: "May", projects: 42, proposals: 36 },
	{ month: "June", projects: 38, proposals: 33 },
];

export const config = {
	projects: { label: "Projects published", color: "var(--chart-1)" },
	proposals: { label: "Proposals accepted", color: "var(--chart-2)" },
} satisfies ChartConfig;

export const x = { key: "month" } as const;

export const both = { keys: ["projects", "proposals"] } as const;

export const one = { keys: ["projects"] } as const;

export const shortMonth = (value: unknown) => `${value}`.slice(0, 3);

export const FRAME = "w-full";

/** A bottom legend sits inside the root's box, so the margin makes room. */
export const LEGEND_MARGIN = {
	top: 8,
	right: 8,
	bottom: 52,
	left: 40,
} as const;

export const PLAIN_MARGIN = { top: 8, right: 8, bottom: 28, left: 40 } as const;

/** A cartesian chart with the usual furniture, so each page varies one mark. */
export function Cartesian({
	children,
	y = one,
	margin = PLAIN_MARGIN,
}: {
	readonly children: ReactNode;
	readonly y?: typeof one | typeof both;
	readonly margin?: {
		readonly top: number;
		readonly right: number;
		readonly bottom: number;
		readonly left: number;
	};
}) {
	return (
		<Chart.Root
			config={config}
			data={data}
			x={x}
			y={y}
			className={FRAME}
			margin={margin}
		>
			{children}
		</Chart.Root>
	);
}

export const axes = (
	<>
		<Chart.XAxis tickFormatter={shortMonth} />
		<Chart.YAxis />
	</>
);

export const SQUARE = "mx-auto aspect-square w-full max-w-72";

export const ROUND_MARGIN = { top: 0, right: 0, bottom: 48, left: 0 } as const;

export const shareData = [
	{ discipline: "design", freelancers: 86 },
	{ discipline: "development", freelancers: 54 },
	{ discipline: "writing", freelancers: 37 },
	{ discipline: "consulting", freelancers: 21 },
];

export const shareConfig = {
	freelancers: { label: "Freelancers" },
	design: { label: "Design", color: "var(--chart-1)" },
	development: { label: "Development", color: "var(--chart-2)" },
	writing: { label: "Writing", color: "var(--chart-3)" },
	consulting: { label: "Consulting", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function Round({ children }: { readonly children: ReactNode }) {
	return (
		<Chart.Root
			config={shareConfig}
			data={shareData}
			x={{ key: "discipline" }}
			y={{ keys: ["freelancers"] }}
			className={SQUARE}
			margin={ROUND_MARGIN}
			interactive={false}
		>
			{children}
			<Chart.Tooltip
				content={<Chart.TooltipContent nameKey="discipline" hideLabel />}
			/>
			<Chart.Legend content={<Chart.LegendContent nameKey="discipline" />} />
		</Chart.Root>
	);
}
