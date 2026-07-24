import { TextAlignLeftIcon } from "@phosphor-icons/react";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import { RichTextEditable } from "#/blocks/rich-text-editable.tsx";
import type { EmailEditorParagraphBlock } from "#/document/types.ts";
import { EMAIL_COLOR, EMAIL_FONT } from "#/theme.ts";

/**
 * A rich body paragraph, edited in place (bold, italic, underline and links
 * via the block toolbar). Mirrors the domain `emailParagraph` component
 * (16px ink).
 */
function ParagraphBlockView({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorParagraphBlock>) {
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

function ParagraphBlockSettings() {
	return (
		<p className="text-muted-foreground text-xs">
			{
				"Format the text (bold, italic, underline, link) from the block toolbar. Personalize with {{firstName}}, {{lastName}} or {{email}}; the contact's value is substituted at send time."
			}
		</p>
	);
}

export const paragraphBlockDefinition: EmailBlockDefinition<EmailEditorParagraphBlock> =
	{
		label: "Paragraph",
		icon: TextAlignLeftIcon,
		View: ParagraphBlockView,
		Settings: ParagraphBlockSettings,
	};
