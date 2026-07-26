import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { AlignmentOption } from "#/email-block-editor/components/block-options/alignment-option.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { TextAreaOption } from "#/email-block-editor/components/block-options/text-area-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import type { EmailEditorStatBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorStatBlock> {}

/** The settings panel for a stat block. */
export function StatBlockSettings({ block, onChange }: Props) {
	return (
		<>
			<BlockOptionSection title="Content">
				<TextOption
					label="Value"
					value={block.value}
					onChange={(value) => onChange({ ...block, value })}
					placeholder="128"
				/>
				<TextOption
					label="Label"
					value={block.label}
					onChange={(label) => onChange({ ...block, label })}
					placeholder="Projects delivered"
				/>
				<TextAreaOption
					label="Description"
					value={block.description}
					onChange={(description) => onChange({ ...block, description })}
					rows={2}
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Appearance">
				<AlignmentOption
					value={block.align}
					onChange={(align) => onChange({ ...block, align })}
				/>
			</BlockOptionSection>
		</>
	);
}
