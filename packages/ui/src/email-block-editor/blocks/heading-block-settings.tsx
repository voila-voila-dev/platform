import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { SelectOption } from "#/email-block-editor/components/block-options/select-option.tsx";
import { TextOption } from "#/email-block-editor/components/block-options/text-option.tsx";
import type {
	EmailEditorHeadingBlock,
	EmailEditorHeadingLevel,
} from "#/email-block-editor/document/types.ts";
import { EMAIL_HEADING_STYLE } from "#/email-block-editor/theme.ts";

const HEADING_LEVEL_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorHeadingLevel;
	readonly label: string;
}> = [
	{ value: 1, label: EMAIL_HEADING_STYLE[1].label },
	{ value: 2, label: EMAIL_HEADING_STYLE[2].label },
];

interface Props extends EmailBlockComponentProps<EmailEditorHeadingBlock> {}

/** The settings panel for a heading block. */
export function HeadingBlockSettings({ block, onChange }: Props) {
	return (
		<>
			<TextOption
				label="Text"
				value={block.text}
				onChange={(text) => onChange({ ...block, text })}
			/>
			<SelectOption
				label="Level"
				value={block.level}
				options={HEADING_LEVEL_OPTIONS}
				onChange={(level) => onChange({ ...block, level })}
			/>
		</>
	);
}
