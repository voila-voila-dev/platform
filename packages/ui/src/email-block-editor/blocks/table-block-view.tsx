import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import type { EmailEditorTableBlock } from "#/email-block-editor/document/types.ts";
import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";
import { cn } from "#/lib/utils.ts";

/** Mirrors `emailLineItemsTable`'s `flushEdges`: the first and last columns
 * lose their outer padding, so the table's text lines up with the blocks above
 * and below it. */
const cellPaddingClassName = (index: number, columnCount: number): string =>
	cn(
		"py-2",
		index === 0 ? "pl-0" : "pl-[10px]",
		index === columnCount - 1 ? "pr-0" : "pr-[10px]",
	);
/** A row padded (or trimmed) to the current column count. */
const rowOfWidth = (
	row: ReadonlyArray<string>,
	width: number,
): ReadonlyArray<string> =>
	Array.from({ length: width }, (_, index) => row[index] ?? "");

interface Props extends EmailBlockComponentProps<EmailEditorTableBlock> {}

/**
 * A plain-text data table — an order recap, a schedule, a price list. Mirrors
 * the domain `emailLineItemsTable` component: header rules, row separators and
 * per-column alignment. Cells are edited in place.
 */
export function TableBlockView({ block, onChange }: Props) {
	const setCell = (rowIndex: number, columnIndex: number, value: string) =>
		onChange({
			...block,
			rows: block.rows.map((row, at) =>
				at === rowIndex
					? rowOfWidth(row, block.columns.length).map((cell, column) =>
							column === columnIndex ? value : cell,
						)
					: row,
			),
		});

	return (
		<table
			className="w-full border-collapse"
			style={{ fontFamily: EMAIL_FONT }}
		>
			{block.headerRow ? (
				<thead>
					<tr>
						{block.columns.map((column, columnIndex) => (
							<th
								key={columnIndex}
								className={cellPaddingClassName(
									columnIndex,
									block.columns.length,
								)}
								style={{
									borderBottom: `2px solid ${EMAIL_COLOR.border}`,
									textAlign: column.align,
								}}
							>
								<BlockTextInput
									ariaLabel={`Column ${columnIndex + 1} title`}
									value={column.label}
									placeholder="Column"
									onChange={(label) =>
										onChange({
											...block,
											columns: block.columns.map((current, at) =>
												at === columnIndex ? { ...current, label } : current,
											),
										})
									}
									className="font-semibold text-[11px] uppercase leading-[1.3] tracking-[0.04em]"
									style={{ color: EMAIL_COLOR.muted, textAlign: column.align }}
								/>
							</th>
						))}
					</tr>
				</thead>
			) : null}
			<tbody>
				{block.rows.map((row, rowIndex) => (
					<tr key={rowIndex}>
						{rowOfWidth(row, block.columns.length).map((cell, columnIndex) => (
							<td
								key={columnIndex}
								className={cellPaddingClassName(
									columnIndex,
									block.columns.length,
								)}
								style={{ borderBottom: `1px solid ${EMAIL_COLOR.border}` }}
							>
								<BlockTextInput
									ariaLabel={`Row ${rowIndex + 1}, column ${columnIndex + 1}`}
									value={cell}
									onChange={(value) => setCell(rowIndex, columnIndex, value)}
									className="text-[14px] leading-[1.4]"
									style={{
										color: EMAIL_COLOR.ink,
										textAlign: block.columns[columnIndex]?.align ?? "left",
									}}
								/>
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
