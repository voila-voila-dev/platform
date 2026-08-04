import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { AlignmentOption } from "#/email-block-editor/components/block-options/alignment-option.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorHighlightBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorHighlightBlock> {}

/** The settings panel for a highlight block. */
export function HighlightBlockSettings({ block, onChange }: Props) {
	const { chrome } = useEmailEditorLabels();
	return (
		<BlockOptionSection title={chrome.sectionAppearance}>
			<AlignmentOption
				value={block.align}
				onChange={(align) => onChange({ ...block, align })}
			/>
		</BlockOptionSection>
	);
}
