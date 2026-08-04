import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { RichTextEditable } from "#/email-block-editor/blocks/rich-text-editable.tsx";
import type { EmailEditorFinePrintBlock } from "#/email-block-editor/document/types.ts";
import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

interface Props extends EmailBlockComponentProps<EmailEditorFinePrintBlock> {}

/**
 * The small print at the foot of the email — offer conditions, validity dates,
 * disclaimers. Small, muted and centred so it reads as a footnote; links (to
 * the terms, say) work through the shared span model.
 */
export function FinePrintBlockView({ block, onChange }: Props) {
	return (
		<RichTextEditable
			spans={block.spans}
			onChange={(spans) => onChange({ ...block, spans })}
			ariaLabel="Fine print"
			placeholder="Offer valid until…"
			className="text-center text-[11px] leading-[1.5]"
			style={{ fontFamily: EMAIL_FONT, color: EMAIL_COLOR.muted }}
		/>
	);
}
