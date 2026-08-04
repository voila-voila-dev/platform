import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { AlignmentOption } from "#/email-block-editor/components/block-options/alignment-option.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { TextAreaOption } from "#/email-block-editor/components/block-options/text-area-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorStatBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorStatBlock> {}

/** The settings panel for a stat block. */
export function StatBlockSettings({ block, onChange }: Props) {
	const { chrome, fields, blocks } = useEmailEditorLabels();
	return (
		<>
			<BlockOptionSection title={chrome.sectionContent}>
				<TextOption
					label={fields.value}
					value={block.value}
					onChange={(value) => onChange({ ...block, value })}
					placeholder={blocks.stat.valuePlaceholder}
				/>
				<TextOption
					label={fields.label}
					value={block.label}
					onChange={(label) => onChange({ ...block, label })}
					placeholder={blocks.stat.labelPlaceholder}
				/>
				<TextAreaOption
					label={fields.description}
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
					rows={2}
				/>
			</BlockOptionSection>
			<BlockOptionSection title={chrome.sectionAppearance}>
				<AlignmentOption
					value={block.align}
					onChange={(align) => onChange({ ...block, align })}
				/>
			</BlockOptionSection>
		</>
	);
}
