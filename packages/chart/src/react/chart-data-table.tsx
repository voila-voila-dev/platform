import type { ChartFocusStop } from "#/core/nearest.ts";
import type { ChartScene } from "#/core/types.ts";
import { SR_ONLY } from "#/react/sr-only.ts";

/**
 * The chart's content as a table, for anyone who cannot read the picture: a
 * screen reader gets the actual numbers, not a one-line summary of them. One
 * row per focus stop, one column per series, the same values the tooltip
 * shows.
 *
 * The hiding goes on a wrapper: a table box ignores `width: 1px` and lays out
 * at its content width, which widened the page on a phone.
 */
export function ChartDataTable({
	scene,
	stops,
	caption,
}: {
	scene: ChartScene;
	stops: ReadonlyArray<ChartFocusStop>;
	caption: string;
}) {
	if (stops.length === 0) {
		return null;
	}
	const series = new Map<string, string>();
	for (const point of scene.points) {
		const key = point.series ?? point.markId;
		if (!series.has(key)) {
			series.set(key, point.seriesLabel ?? scene.yLabel);
		}
	}
	const columns = [...series.entries()];
	return (
		<div style={SR_ONLY}>
			<table data-slot="chart-data-table">
				<caption>{caption}</caption>
				<thead>
					<tr>
						<th scope="col">{scene.xLabel}</th>
						{columns.map(([key, label]) => (
							<th key={key} scope="col">
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{stops.map((stop) => (
						<tr key={stop.key}>
							<th scope="row">{stop.points[0].title}</th>
							{columns.map(([key]) => (
								<td key={key}>
									{stop.points.find(
										(point) => (point.series ?? point.markId) === key,
									)?.value ?? ""}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
