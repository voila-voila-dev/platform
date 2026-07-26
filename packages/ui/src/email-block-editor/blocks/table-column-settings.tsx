import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import type {
	EmailEditorTableBlock,
	EmailEditorTableColumn,
} from "#/email-block-editor/document/types.ts";

const ALIGN_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorTableColumn["align"];
	readonly label: string;
}> = [
	{ value: "left", label: "Left" },
	{ value: "right", label: "Right" },
];

interface Props {
	block: EmailEditorTableBlock;
	onChange: (block: EmailEditorTableBlock) => void;
}

/**
 * One table column's header and alignment, inside the table block's
 * settings.
 */
export function TableColumnSettings({ block, onChange }: Props) {
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
