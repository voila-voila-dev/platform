import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { RichTextEditable } from "#/email-block-editor/blocks/rich-text-editable.tsx";
import {
	useEmailEditorLabels,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorParagraphBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorParagraphBlock> {}

/**
 * A rich body paragraph, edited in place (bold, italic, underline and links
 * via the block toolbar). Mirrors the domain `emailParagraph` component
 * (16px ink).
 */
export function ParagraphBlockView({ block, onChange }: Props) {
	const theme = useEmailEditorTheme();
	const { blocks } = useEmailEditorLabels();
	return (
		<RichTextEditable
			spans={block.spans}
			onChange={(spans) => onChange({ ...block, spans })}
			ariaLabel={blocks.paragraph.ariaLabel}
			placeholder={blocks.paragraph.placeholder}
			className="text-[16px] leading-[1.6]"
			style={{ fontFamily: theme.font, color: theme.color.ink }}
		/>
	);
}
