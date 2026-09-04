import { readNumber } from "#/chart/core/chart-model.ts";
import { type ChartConfig, seriesLabelText } from "#/chart/core/config.ts";
import { formatTickValue } from "#/chart/core/format.ts";
import type { ChartDatum } from "#/chart/core/types.ts";

interface Props {
	readonly caption: string;
	readonly categoryLabel: string;
	readonly categories: ReadonlyArray<string>;
	readonly valueKeys: ReadonlyArray<string>;
	readonly data: ReadonlyArray<ChartDatum>;
	readonly config: ChartConfig;
}

/**
 * The chart's content, as a table, for anyone who cannot read the picture.
 * Visually hidden but present in the accessibility tree, so a screen reader
 * gets the actual numbers rather than a one-line summary of them.
 *
 * The hiding goes on a wrapper, not on the table: a table box ignores
 * `overflow: hidden` and lays out at its content width whatever `width: 1px`
 * says, so a table hidden directly still widened its scroll container — a
 * phone showing a chart could scroll sideways into nothing.
 */
export function ChartDataTable({
	caption,
	categoryLabel,
	categories,
	valueKeys,
	data,
	config,
}: Props) {
	if (data.length === 0 || valueKeys.length === 0) {
		return null;
	}

	return (
		<div className="sr-only">
			<table data-slot="chart-data-table">
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
		</div>
	);
}
