import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { RichTextEditable } from "#/email-block-editor/blocks/rich-text-editable.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorFinePrintBlock } from "#/email-block-editor/document/types.ts";

interface Props extends EmailBlockComponentProps<EmailEditorFinePrintBlock> {}

/**
 * The small print at the foot of the email — offer conditions, validity dates,
 * disclaimers. Small, muted and centred so it reads as a footnote; links (to
 * the terms, say) work through the shared span model.
 */
export function FinePrintBlockView({ block, onChange }: Props) {
	const theme = useEmailEditorTheme();
	return (
		<RichTextEditable
			spans={block.spans}
			onChange={(spans) => onChange({ ...block, spans })}
			ariaLabel="Fine print"
			placeholder="Offer valid until…"
			className="text-center text-[11px] leading-[1.5]"
			style={{ fontFamily: theme.font, color: theme.color.muted }}
		/>
	);
}
