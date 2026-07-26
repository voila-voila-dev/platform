import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { RichTextEditable } from "#/email-block-editor/blocks/rich-text-editable.tsx";
import type { EmailEditorParagraphBlock } from "#/email-block-editor/document/types.ts";
import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

interface Props extends EmailBlockComponentProps<EmailEditorParagraphBlock> {}

/**
 * A rich body paragraph, edited in place (bold, italic, underline and links
 * via the block toolbar). Mirrors the domain `emailParagraph` component
 * (16px ink).
 */
export function ParagraphBlockView({ block, onChange }: Props) {
	return (
		<RichTextEditable
			spans={block.spans}
			onChange={(spans) => onChange({ ...block, spans })}
			ariaLabel="Paragraph"
			placeholder="Your text. Use {{firstName}} to personalize."
			className="text-[16px] leading-[1.6]"
			style={{ fontFamily: EMAIL_FONT, color: EMAIL_COLOR.ink }}
		/>
	);
}
