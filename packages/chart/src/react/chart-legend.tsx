import type { ChartLegendItem } from "#/core/types.ts";

function Swatch({ item }: { item: ChartLegendItem }) {
	const base = { flex: "none" as const, display: "inline-block" };
	if (item.shape === "line" || item.shape === "dashed") {
		return (
			<span
				aria-hidden="true"
				style={{
					...base,
					width: 14,
					height: 0,
					borderTop: `2px ${item.shape === "dashed" ? "dashed" : "solid"} ${item.color}`,
				}}
			/>
		);
	}
	return (
		<span
			aria-hidden="true"
			style={{
				...base,
				width: 10,
				height: 10,
				borderRadius: item.shape === "dot" ? "50%" : 2,
				background: item.color,
			}}
		/>
	);
}

/**
 * One toggle button per series. Turning a series off redraws without it but
 * keeps the axes where they were, so the other series do not jump.
 */
export function ChartLegend({
	items,
	hidden,
	label,
	onToggle,
}: {
	items: ReadonlyArray<ChartLegendItem>;
	hidden: ReadonlySet<string>;
	label: string;
	onToggle: (key: string) => void;
}) {
	return (
		<ul
			aria-label={label}
			data-slot="chart-legend"
			style={{
				display: "flex",
				flexWrap: "wrap",
				justifyContent: "center",
				gap: 4,
				margin: 0,
				padding: 0,
				listStyle: "none",
				fontSize: 12,
			}}
		>
			{items.map((item) => {
				const visible = !hidden.has(item.key);
				return (
					<li key={item.key}>
						<button
							type="button"
							aria-pressed={visible}
							onClick={() => onToggle(item.key)}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 6,
								minHeight: 24,
								padding: "2px 8px",
								border: 0,
								borderRadius: 6,
								background: "transparent",
								color: "inherit",
								font: "inherit",
								cursor: "pointer",
								opacity: visible ? 1 : 0.45,
								textDecoration: visible ? undefined : "line-through",
							}}
						>
							<Swatch item={item} />
							{item.label}
						</button>
					</li>
				);
			})}
		</ul>
	);
}
