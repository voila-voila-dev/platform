import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorHeadingBlock,
	EmailEditorHeadingLevel,
} from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorHeadingBlock> {}

/** The settings panel for a heading block. */
export function HeadingBlockSettings({ block, onChange }: Props) {
	const { fields, blocks } = useEmailEditorLabels();
	const levelOptions: ReadonlyArray<{
		readonly value: EmailEditorHeadingLevel;
		readonly label: string;
	}> = [
		{ value: 1, label: blocks.heading.level1 },
		{ value: 2, label: blocks.heading.level2 },
	];
	return (
		<>
			<TextOption
				label={fields.text}
				value={block.text}
				onChange={(text) => onChange({ ...block, text })}
			/>
			<SelectOption
				label={blocks.heading.level}
				value={block.level}
				options={levelOptions}
				onChange={(level) => onChange({ ...block, level })}
			/>
		</>
	);
}
