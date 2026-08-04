import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { TableColumnSettings } from "#/email-block-editor/blocks/table-column-settings.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { ToggleOption } from "#/email-block-editor/components/block-options/toggle-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorTableBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorTableBlock> {}

/** The settings panel for a table block. */
export function TableBlockSettings({ block, onChange }: Props) {
	const { chrome, blocks } = useEmailEditorLabels();
	return (
		<>
			<BlockOptionSection title={chrome.sectionContent}>
				<div className="flex items-center justify-between gap-2 text-sm">
					<span className="text-muted-foreground">
						{blocks.table.rowCount(block.rows.length)}
					</span>
					<div className="flex gap-1">
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label={blocks.table.removeLastRow}
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
							{blocks.table.addRow}
						</Button>
					</div>
				</div>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionAppearance}>
				<ToggleOption
					label={blocks.table.headerRow}
					checked={block.headerRow}
					onChange={(headerRow) => onChange({ ...block, headerRow })}
				/>
				<TableColumnSettings block={block} onChange={onChange} />
			</BlockOptionSection>
		</>
	);
}
