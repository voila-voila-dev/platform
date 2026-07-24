import { PlusIcon, TableIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/components/button";
import { cn } from "@voila.dev/ui/lib/utils";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/blocks/block-text-input.tsx";
import type {
	EmailEditorTableBlock,
	EmailEditorTableColumn,
} from "#/document/types.ts";
import { BlockOptionSection } from "#/sections/block-options/block-option-row.tsx";
import {
	SelectOption,
	ToggleOption,
} from "#/sections/block-options/select-option.tsx";
import { EMAIL_COLOR, EMAIL_FONT } from "#/theme.ts";

const ALIGN_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorTableColumn["align"];
	readonly label: string;
}> = [
	{ value: "left", label: "Left" },
	{ value: "right", label: "Right" },
];

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

/**
 * A plain-text data table — an order recap, a schedule, a price list. Mirrors
 * the domain `emailLineItemsTable` component: header rules, row separators and
 * per-column alignment. Cells are edited in place.
 */
function TableBlockView({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorTableBlock>) {
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

function TableColumnSettings({
	block,
	onChange,
}: {
	block: EmailEditorTableBlock;
	onChange: (block: EmailEditorTableBlock) => void;
}) {
	return (
		<>
			{block.columns.map((column, index) => (
				<div key={index} className="flex items-end gap-2">
					<div className="flex-1">
						<SelectOption
							label={column.label.trim() || `Column ${index + 1}`}
							value={column.align}
							options={ALIGN_OPTIONS}
							onChange={(align) =>
								onChange({
									...block,
									columns: block.columns.map((current, at) =>
										at === index ? { ...current, align } : current,
									),
								})
							}
						/>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label={`Remove column ${index + 1}`}
						disabled={block.columns.length === 1}
						onClick={() =>
							onChange({
								...block,
								columns: block.columns.filter((_, at) => at !== index),
								rows: block.rows.map((row) =>
									row.filter((_, at) => at !== index),
								),
							})
						}
					>
						<XIcon aria-hidden />
					</Button>
				</div>
			))}
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					onChange({
						...block,
						columns: [...block.columns, { label: "", align: "left" }],
						rows: block.rows.map((row) => [...row, ""]),
					})
				}
			>
				<PlusIcon aria-hidden />
				Add a column
			</Button>
		</>
	);
}

function TableBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorTableBlock>) {
	return (
		<>
			<BlockOptionSection title="Content">
				<div className="flex items-center justify-between gap-2 text-sm">
					<span className="text-muted-foreground">
						{block.rows.length} row{block.rows.length > 1 ? "s" : ""}
					</span>
					<div className="flex gap-1">
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Remove the last row"
							disabled={block.rows.length === 1}
							onClick={() =>
								onChange({ ...block, rows: block.rows.slice(0, -1) })
							}
						>
							<XIcon aria-hidden />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								onChange({
									...block,
									rows: [...block.rows, block.columns.map(() => "")],
								})
							}
						>
							<PlusIcon aria-hidden />
							Row
						</Button>
					</div>
				</div>
			</BlockOptionSection>
			<BlockOptionSection title="Appearance">
				<ToggleOption
					label="Header row"
					checked={block.headerRow}
					onChange={(headerRow) => onChange({ ...block, headerRow })}
				/>
				<TableColumnSettings block={block} onChange={onChange} />
			</BlockOptionSection>
		</>
	);
}

export const tableBlockDefinition: EmailBlockDefinition<EmailEditorTableBlock> =
	{
		label: "Table",
		icon: TableIcon,
		View: TableBlockView,
		Settings: TableBlockSettings,
	};
