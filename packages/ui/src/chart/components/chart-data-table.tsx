import { readNumber } from "#/chart/core/chart-model.ts";
import { type ChartConfig, seriesLabelText } from "#/chart/core/config.ts";
import { formatTickValue } from "#/chart/core/format.ts";
import type { ChartDatum } from "#/chart/core/types.ts";

/**
 * The chart's content, as a table, for anyone who cannot read the picture.
 * Visually hidden but present in the accessibility tree, so a screen reader
 * gets the actual numbers rather than a one-line summary of them.
 */
export function ChartDataTable({
	caption,
	categoryLabel,
	categories,
	valueKeys,
	data,
	config,
}: {
	readonly caption: string;
	readonly categoryLabel: string;
	readonly categories: ReadonlyArray<string>;
	readonly valueKeys: ReadonlyArray<string>;
	readonly data: ReadonlyArray<ChartDatum>;
	readonly config: ChartConfig;
}) {
	if (data.length === 0 || valueKeys.length === 0) {
		return null;
	}

	return (
		<table data-slot="chart-data-table" className="sr-only">
			<caption>{caption}</caption>
			<thead>
				<tr>
					<th scope="col">{categoryLabel}</th>
					{valueKeys.map((key) => (
						<th key={key} scope="col">
							{seriesLabelText(config, key)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((datum, index) => (
					<tr key={`${categories[index]}-${index}`}>
						<th scope="row">{categories[index]}</th>
						{valueKeys.map((key) => (
							<td key={key}>{formatTickValue(readNumber(datum, key))}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
