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
			ariaLabel="Paragraphe"
			placeholder="Votre texte. Utilisez {{firstName}} pour personnaliser."
			className="text-[16px] leading-[1.6]"
			style={{ fontFamily: EMAIL_FONT, color: EMAIL_COLOR.ink }}
		/>
	);
}

function ParagraphBlockSettings() {
	return (
		<p className="text-muted-foreground text-xs">
			{
				"Mettez en forme le texte (gras, italique, souligné, lien) depuis la barre d'outils du bloc. Personnalisez avec {{firstName}}, {{lastName}} ou {{email}} ; la valeur du contact est substituée à l'envoi."
			}
		</p>
	);
}

export const paragraphBlockDefinition: EmailBlockDefinition<EmailEditorParagraphBlock> =
	{
		label: "Paragraphe",
		icon: TextAlignLeftIcon,
		View: ParagraphBlockView,
		Settings: ParagraphBlockSettings,
	};
